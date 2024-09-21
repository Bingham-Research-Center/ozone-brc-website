import os
import datetime
import requests
import time
import pandas as pd
from datetime import timedelta
from requests.exceptions import (
    ConnectTimeout,
    HTTPError,
    ReadTimeout,
    Timeout,
    ConnectionError,
)


def pull_weather_data():
    # Set the date to be used in the data
    xmldate = datetime.datetime.now() - timedelta(hours=1)
    xmldate = xmldate.replace(second=0, microsecond=0)
    formatted_date = xmldate.strftime('%Y-%m-%d %H:%M:%S')

    try:
        # Pull Dry Fork data from Weather Underground api is on teams website files.
        api_url = (
            'https://api.weather.com/v2/pws/observations/current?'
            'stationId=KUTVERNA21&format=json&units=e&apiKey=YOUR_API_KEY'
        )
        response = requests.get(api_url, timeout=6.0)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except (ConnectTimeout, HTTPError, ReadTimeout, Timeout, ConnectionError) as e:
        print(f"Error fetching data: {e}")
        return

    try:
        data = response.json()['observations'][0]
        imperial = data['imperial']

        # Create a dictionary with the data
        weather_data = {
            'datetime': [formatted_date],
            'temperature_f': [imperial['temp']],
            'humidity_percent': [data['humidity']],
            'pressure_inHg': [imperial['pressure']],
            'daily_precip_in': [imperial['precipTotal']],
            'precip_rate_in_per_hr': [imperial['precipRate']],
            'wind_speed_mph': [imperial['windSpeed']],
            'wind_direction_deg': [data['winddir']],
        }

        # Convert the dictionary to a pandas DataFrame
        df = pd.DataFrame(weather_data)
        print(df)

        # Define the directory to store .h5 files
        directory = 'weather_data'
        os.makedirs(directory, exist_ok=True)  # Create directory if it doesn't exist

        # Generate a filename based on the current date and time
        timestamp = datetime.datetime.now().strftime('%m%d%Y_%H%M%S')
        hdf5_filename = f'weather_data_{timestamp}.h5'
        file_path = os.path.join(directory, hdf5_filename)

        # Store the DataFrame as an HDF5 file
        with pd.HDFStore(file_path) as hdf:
            # Since each file is unique, you can use a fixed key like 'weather'
            hdf.put('weather', df, format='table', data_columns=True)

        print(f"Data stored in {file_path}")

    except (KeyError, IndexError, ValueError) as e:
        print(f"Error parsing data: {e}")


def should_pull_data():
    now = datetime.datetime.now()
    target_minutes = [15, 30, 45, 58]
    return now.minute in target_minutes and now.second == 0


def main():
    while True:
        if should_pull_data():
            pull_weather_data()
            time.sleep(60)  # Wait to avoid multiple pulls within the same minute
        else:
            time.sleep(0.5)  # Check again after a short delay


if __name__ == "__main__":
    main()