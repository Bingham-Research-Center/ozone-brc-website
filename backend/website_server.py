from flask import Flask, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='../frontend/elspeth_prototype', static_url_path='')

# Load data
def load_json_data(filename):
    filepath = os.path.join('../../..', 'test_data', filename)
    with open(filepath, 'r') as f:
        data = json.load(f)
    return data

@app.route('/api/obs')
def get_obs_data():
    obs_data = load_json_data('test_liveobs.json')
    return jsonify(obs_data)

@app.route('/api/wind')
def get_wind_data():
    wind_data = load_json_data('test_wind_ts.json')
    return jsonify(wind_data)

# Serve the frontend files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
