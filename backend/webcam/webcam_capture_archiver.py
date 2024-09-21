"""
# Webcam Capture and Archiving Script

This script is designed to capture images from multiple webcams at scheduled intervals and archive those images.
It was repurposed and developed by Michael Davies from old code originally written by Dr. Seth Lyman.
The script automates the process of capturing and archiving webcam footage while logging all significant events.

## Key Features: - **Webcam Configurations**: The script defines four webcams using their RTSP stream URLs. -
**Directory Setup**: Automatically creates directories for saving and archiving captured images, ensuring proper
organization. - **Image Capture**: Captures images from each webcam at specific intervals (minute 4 and 34 of each
hour) during active hours (6 AM to 8 PM). - **Archiving**: Moves captured images to an archive folder at regular
intervals (minute 8, 12, and 16 of each hour). - **Error Handling**: Includes logging for errors or failures during
image capture or archiving. - **Automated Operation**: The script continuously runs until manually stopped and logs
all activities to a `webcams.log` file.

## Repurposed by:
Michael Davies
Developed from code originally written by Dr. Seth Lyman.
"""

import os
import cv2
import shutil
import datetime
import time
import logging

# Define webcam configurations find code for webcams on teams in Website files.
webcams = {
    'horsepool': '',
    'roosevelt': '',
    'castle_peak': '',
    'seven_sisters': ''
}

# Get the current working directory dynamically
base_directory = os.getcwd()  # This will be where the script is being executed from
save_directory = os.path.join(base_directory, 'webcams')
archive_directory = os.path.join(save_directory, 'photoarchive')

# Create base directories if they don't exist
os.makedirs(save_directory, exist_ok=True)
os.makedirs(archive_directory, exist_ok=True)

# Create a save and archive folder for each webcam with lowercase names
for name in webcams.keys():
    os.makedirs(os.path.join(save_directory, name), exist_ok=True)  # Save directory for each webcam
    os.makedirs(os.path.join(archive_directory, f"{name}_webcam"), exist_ok=True)  # Archive directory for each webcam

# Set up logging
log_file = os.path.join(save_directory, 'webcams.log')
logging.basicConfig(filename=log_file, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


def capture_image(webcam_name, url):
    """
    Captures an image from a given webcam stream and saves it with a unique timestamped filename.

    Parameters:
    webcam_name (str): The name of the webcam.
    url (str): The RTSP stream URL for the webcam.
    """
    try:
        webcam = cv2.VideoCapture(url)
        ret, frame = webcam.read()
        if ret:
            now = datetime.datetime.now()
            timestamp = now.strftime('%Y%m%d_%H%M%S')  # Format: YYYYMMDD_HHMMSS
            image_filename = f"{webcam_name}_{timestamp}.jpg"
            image_path = os.path.join(save_directory, webcam_name, image_filename)
            cv2.imwrite(image_path, frame)
            logging.info(f"Successfully captured image from {webcam_name}: {image_filename}")
            print(f"Successfully captured image from {webcam_name}: {image_filename}")  # For terminal output
        else:
            logging.error(f"Failed to capture image from {webcam_name}")
            print(f"Failed to capture image from {webcam_name}")  # For terminal output
        webcam.release()
    except Exception as e:
        logging.error(f"Error capturing image from {webcam_name}: {e}")
        print(f"Error capturing image from {webcam_name}: {e}")  # For terminal output


def archive_images():
    """
    Archives captured webcam images by moving them to their respective archive directories.
    """
    try:
        for name in webcams.keys():
            webcam_save_dir = os.path.join(save_directory, name)
            archive_dir = os.path.join(archive_directory, f"{name}_webcam")

            # Ensure archive directory exists
            if not os.path.exists(archive_dir):
                os.makedirs(archive_dir)
                logging.info(f"Created archive directory: {archive_dir}")
                print(f"Created archive directory: {archive_dir}")  # For terminal output

            # Iterate over all images in the webcam's save directory
            for filename in os.listdir(webcam_save_dir):
                if filename.endswith('.jpg'):
                    src_path = os.path.join(webcam_save_dir, filename)
                    dst_path = os.path.join(archive_dir, filename)
                    try:
                        shutil.move(src_path, dst_path)  # Move the file to archive
                        logging.info(f"Archived image for {name}: {filename}")
                        print(f"Archived image for {name}: {filename}")  # For terminal output
                    except Exception as move_err:
                        logging.error(f"Failed to archive {filename} for {name}: {move_err}")
                        print(f"Failed to archive {filename} for {name}: {move_err}")  # For terminal output
    except Exception as e:
        logging.error(f"Error archiving images: {e}")
        print(f"Error archiving images: {e}")  # For terminal output


def calculate_sleep_time(now):
    """
    Calculates how long to sleep until the next full minute.

    Parameters:
    now (datetime): The current time.

    Returns:
    float: Seconds to sleep until the next minute.
    """
    next_minute = (now + datetime.timedelta(minutes=1)).replace(second=0, microsecond=0)
    return (next_minute - now).total_seconds()


def main_loop():
    """
    Main loop that captures and archives webcam images at scheduled times.
    """
    while True:
        now = datetime.datetime.now()
        current_minute = now.minute
        current_hour = now.hour

        # Define capture schedule
        capture_minutes = [4, 34]  # Capture at minute 4 and 34
        active_hours = range(6, 20)  # Between 6 AM and 8 PM

        # Define archive schedule
        archive_minutes = [8, 12, 16]  # Archive at minute 8, 12, and 16

        # Capture images at minute 4 and 34 past each hour between 6 AM and 8 PM
        if (current_minute in capture_minutes) and (current_hour in active_hours):
            for name, url in webcams.items():
                capture_image(name, url)

        # Archive images at minutes 8, 12, and 16 past each hour
        if current_minute in archive_minutes:
            archive_images()

        # Sleep until the start of the next minute
        sleep_time = calculate_sleep_time(now)
        time.sleep(sleep_time)


if __name__ == "__main__":
    """
    Entry point for the script.

    Starts the main loop that captures and archives webcam images. The script
    will keep running until manually stopped (e.g., with Ctrl+C). 
    It also logs significant events (like capturing or archiving an image)
    to a file called 'webcams.log'.
    """
    try:
        logging.info("Starting webcam capture loop...")
        print("Starting webcam capture loop...")
        main_loop()
    except KeyboardInterrupt:
        logging.info("Webcam capture loop stopped by user.")
        print("Webcam capture loop stopped by user.")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        print(f"Unexpected error: {e}")