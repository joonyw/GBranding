# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask import Flask, send_from_directory, send_file
import os
from utils import *
from models import db, bcrypt, User

# app.py
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from io import BytesIO
from PIL import Image
import os
from models import User



# app = Flask(__name__)

app = Flask(__name__, static_folder='build', static_url_path='')
# app = Flask(__name__, static_url_path='',
#                   static_folder='build',
#                   template_folder='build')

app.config['SECRET_KEY'] = 'password'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/user_db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://user:password@localhost/user_db'

# app.config['MONGO_URI'] = 'mongodb://localhost:27017/user_db'

# db = SQLAlchemy(app)
# mongo = PyMongo(app)
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

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         email = request.form.get('email')
#         password = request.form.get('password')
#         user = User.query.filter_by(email=email).first()
#         if user and bcrypt.check_password_hash(user.password, password):
#             login_user(user)
#             print("S")
#             return redirect(url_for('dashboard'))
#         else:
#             flash('Login Unsuccessful. Please check email and password', 'danger')
#     return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', methods=['POST'])
def login():
    print("AA")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    print(email)
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        print("SSS")
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Login unsuccessful'}), 401

# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if request.method == 'POST':
#         username = request.form.get('username')
#         email = request.form.get('email')
#         password = request.form.get('password')
#         print("PASS" + username)
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#         user = User(username=username, email=email, password=hashed_password)
#         db.session.add(user)
#         db.session.commit()
#         flash('Your account has been created!', 'success')
#         return redirect(url_for('login'))
#     return send_from_directory(app.static_folder, 'index.html')

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

# @app.route('/dashboard')
# @login_required
# def dashboard():
#     return render_template('dashboard.html', name=current_user.username)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/is_logged_in')
def is_logged_in():
    return jsonify({'logged_in': current_user.is_authenticated})


# @app.route('/submit', methods=['POST'])
# @login_required
# def submit_text():
#     data = request.json
#     submitted_text = data.get('text', '')
#     response = {
#         'message': f'You submitted: {submitted_text}'
#     }
#     return jsonify(response)

# # @app.route('/get-video', methods=['GET'])
# # @login_required
# # def get_video():
# #     return send_from_directory('video', 'example.mp4', as_attachment=False)

# # @app.errorhandler(404)
# # def not_found(e):
# #     return app.send_static_file('index.html')

# # if __name__ == '__main__':
# #     app.run(debug=True)


# # @app.route('/')
# # def serve():
# #     return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit', methods=['POST'])
@login_required
def submit_text():
# @login_required
    data = request.json
    submitted_text = data.get('text', '')
    response_text = scenario(submitted_text)
    speech(response_text)
    get_pic(response_text)
    response = {
        'message': f'You submitted: {response_text}'
    }
    return jsonify(response)

@app.route('/get-video', methods=['GET'])
@login_required
def get_video():

    # Here we are assuming that the video file is stored under `video/example.mp4`
    make_video("./images", "./speech.mp3", "output_video.mp4",0.1)
    return send_from_directory('./', 'output.mp4', as_attachment=False)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
