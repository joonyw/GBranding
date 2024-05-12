# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask import Flask, send_from_directory, send_file
import os
from utils import *

app = Flask(__name__, static_folder='build', static_url_path='')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit', methods=['POST'])
def submit_text():
    data = request.json
    submitted_text = data.get('text', '')
    response_text = create_scenario(submitted_text)
    speech(response_text)
    get_pic(response_text)
    response = {
        'message': f'You submitted: {response_text}'
    }
    return jsonify(response)

@app.route('/get-video', methods=['GET'])
def get_video():
    # Here we are assuming that the video file is stored under `video/example.mp4`
    make_video("./images", "./speech.mp3", "output_video.mp4",0.1)
    return send_from_directory('./', 'output.mp4', as_attachment=False)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
