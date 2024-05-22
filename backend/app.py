from flask import Flask, request, jsonify, send_from_directory
from flask import Flask, send_from_directory, send_file
import os
from utils import *
from models import db, bcrypt, User
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from io import BytesIO
from PIL import Image

app = Flask(__name__, static_folder='build', static_url_path='')

app.config['SECRET_KEY'] = 'password'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://user:password@localhost/user_db'

db.init_app(app)
bcrypt.init_app(app)


login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    print(email)
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Login unsuccessful'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    print("PASS" + username)
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/is_logged_in')
def is_logged_in():
    return jsonify({'logged_in': current_user.is_authenticated})

@app.route('/submit', methods=['POST'])
@login_required
def submit_text():
    data = request.json
    submitted_text = data.get('text', '')
    response_text = create_scenario(submitted_text)
    speech(response_text)
    get_pic(response_text)
    get_brand(response_text)
    response = {
        'message': response_text
    }
    print("ASDF")
    return jsonify(response)

@app.route('/get-video', methods=['GET'])
@login_required
def get_video():
    # return send_from_directory('./', 'output.mp4', as_attachment=False)
    make_video("./images", "./speech.mp3", "output_video.mp4",0.1)
    return send_from_directory('./', 'output.mp4', as_attachment=False)

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
