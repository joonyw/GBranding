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
    print("A")
    data = request.json
    submitted_text = data.get('text', '')
    response_text = create_scenario(submitted_text)
    speech(response_text)
    get_pic(response_text)
    response = {
        'message': f'You submitted: {response_text}'
    }
    return jsonify(response)
@app.route('/get-audio', methods=['GET'])
def get_audio():
    return send_from_directory('./', 'speech.mp3', as_attachment=False)


# Endpoint to serve the image
@app.route('/get-image')
def get_image():
    print("R")
    image_path = os.path.join(os.getcwd(), 'generated_image.jpeg')  # Adjust the image path accordingly
    return send_file(image_path, mimetype='image/jpeg')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
