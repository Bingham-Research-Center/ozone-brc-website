'''
website_server.py

This script sets up a Flask web server to serve both the frontend assets and backend API endpoints.
It is configured to run on port 5001 to avoid conflicts with other services.
'''

from flask import Flask, jsonify, send_from_directory
import json
import os
from dotenv import load_dotenv  # For loading environment variables from a .env file
from flask_cors import CORS  # For handling Cross-Origin Resource Sharing (CORS)

'''
Load environment variables from a .env file if it exists.
This is useful for managing configurations like DEBUG mode and PORT numbers without hardcoding them.
'''
load_dotenv()

'''
Initialize the Flask application.
- static_folder: Specifies the directory from which to serve static files. In this case, it's the 'frontend' directory located one level up from the backend.
- static_url_path: Sets the URL path for static files. An empty string means static files are served from the root.
'''
app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend'),
    static_url_path=''
)

'''
Enable CORS for the Flask app.
This allows your frontend (possibly running on a different origin) to communicate with the backend API without issues.
'''
CORS(app)

'''
Helper function to load JSON data from the 'test_data' directory.
This function takes a filename, constructs the absolute path to the file, and returns the parsed JSON data.
If the file is not found or contains invalid JSON, it returns an error message.
'''


def load_json_data(filename):
    '''
    Load JSON data from the test_data directory.

    Args:
        filename (str): The name of the JSON file to load.

    Returns:
        dict: The loaded JSON data or an error message.
    '''
    # Construct the absolute path to the JSON file
    filepath = os.path.join(os.path.dirname(__file__), '..', 'test_data', filename)
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"error": f"File '{filename}' not found."}
    except json.JSONDecodeError:
        return {"error": f"Error decoding JSON from file '{filename}'."}


'''
API endpoint to retrieve observation data.
When a GET request is made to '/api/obs', this function is called.
It loads the 'test_liveobs.json' file and returns its contents as JSON.
'''


@app.route('/api/obs')
def get_obs_data():
    '''
    Endpoint to retrieve observation data.

    Returns:
        Response: JSON response containing observation data or an error message.
    '''
    obs_data = load_json_data('test_liveobs.json')
    return jsonify(obs_data)


'''
API endpoint to retrieve wind data.
When a GET request is made to '/api/wind', this function is called.
It loads the 'test_wind_ts.json' file and returns its contents as JSON.
'''


@app.route('/api/wind')
def get_wind_data():
    '''
    Endpoint to retrieve wind data.

    Returns:
        Response: JSON response containing wind data or an error message.
    '''
    wind_data = load_json_data('test_wind_ts.json')
    return jsonify(wind_data)


'''
Route to serve the main index.html file.
When a GET request is made to '/', this function serves the 'index.html' from the static folder.
'''


@app.route('/')
def serve_index():
    '''
    Serve the main index.html file.

    Returns:
        Response: The index.html file.
    '''
    return send_from_directory(app.static_folder, 'index.html')


'''
Catch-all route to serve static files.
This handles all other GET requests and serves the corresponding file from the static folder.
For example, a request to '/pages/castle_peak.html' will serve 'frontend/pages/castle_peak.html'.
'''


@app.route('/<path:path>')
def serve_static(path):
    '''
    Serve static files from the frontend directory.

    Args:
        path (str): The path to the file requested.

    Returns:
        Response: The requested static file or 404 if not found.
    '''
    # Prevent accessing API endpoints via this route
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found."}), 404
    return send_from_directory(app.static_folder, path)


'''
Error handler for 404 errors.
If a requested route is not found, this function serves the main index.html.
This is particularly useful for single-page applications that handle routing on the client side.
'''


@app.errorhandler(404)
def not_found(e):
    '''
    Handle 404 errors by serving the main index.html.

    Args:
        e: The exception.

    Returns:
        Response: The index.html file.
    '''
    return send_from_directory(app.static_folder, 'index.html')


'''
Entry point of the application.
When the script is run directly, this block executes.
It reads configuration from environment variables and starts the Flask server.
'''
if __name__ == '__main__':
    '''
    Run the Flask application.

    - debug_mode: Determines if the server runs in debug mode based on the DEBUG environment variable.
    - port: The port number on which the server listens, defaulting to 5001.
    - host: Set to '0.0.0.0' to make the server externally visible.
    '''
    # Determine if the app should run in debug mode
    debug_mode = os.getenv('DEBUG', 'True').lower() in ['true', '1', 't']

    # Set the port to 5001 by default, can be overridden by the PORT environment variable
    port = int(os.getenv('PORT', 5001))

    # Start the Flask server
    app.run(debug=debug_mode, host='0.0.0.0', port=port)