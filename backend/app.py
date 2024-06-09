from flask import Flask, request, jsonify, send_from_directory
from flask import Flask, send_from_directory, send_file
import os
from utils import *
from models import db, bcrypt, User, Scenario
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from io import BytesIO
from PIL import Image
import json    

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
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Login successful', 'admin': user.admin}), 200
    else:
        return jsonify({'message': 'Login unsuccessful'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    admin = data.get('admin', False)
    user = User(username=username, email=email, password=password, admin=admin)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/admin', methods=['GET'])
@login_required
def admin():
    if not current_user.admin:
        return redirect(url_for('index'))
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/is_logged_in')
def is_logged_in():
    return jsonify({'logged_in': current_user.is_authenticated, 'admin': current_user.admin if current_user.is_authenticated else False})
@app.route('/dashboard')
@login_required
def dashboard():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit', methods=['POST'])
@login_required
def submit_text():
    data = request.json
    submitted_text = data.get('text', '')
    response_text = create_scenario(submitted_text)
    speech(response_text)
    # get_brand(response_text)
    get_pic(response_text,submitted_text,current_user.username)
    response = {
        'message': response_text
    }
    scenario = Scenario(user_id=current_user.id, user_input=submitted_text, generated_scenario=response_text, video_filename='')
    db.session.add(scenario)
    db.session.commit()
    return jsonify(response)

@app.route('/get-video', methods=['GET'])
@login_required
def get_video():
    
    import calendar;
    import time;
    
    # gmt stores current gmtime
    gmt = time.gmtime()
    print("gmt:-", gmt)
    
    # ts stores timestamp
    ts = calendar.timegm(gmt)
    print("timestamp:-", ts)
    video_filename = str(current_user.id)+str(ts)+".mp4"
    # Update the latest scenario with the video filename
    scenario = Scenario.query.filter_by(user_id=current_user.id).order_by(Scenario.timestamp.desc()).first()
    if scenario:
        scenario.video_filename = video_filename
        db.session.commit()

    # return send_from_directory('./', 'output.mp4', as_attachment=False)
    make_video("./images/"+str(current_user.username), "./speech.mp3", "./videos/"+str(current_user.id)+str(ts)+".mp4",0.4)
    return send_from_directory('./videos', str(current_user.id)+str(ts)+'.mp4', as_attachment=False)

@app.route('/user/scenarios', methods=['GET'])
@login_required
def get_user_scenarios():
    scenarios = Scenario.query.filter_by(user_id=current_user.id).all()
    scenarios_list = [
        {
            'id': scenario.id,
            'user_input': scenario.user_input,
            'generated_scenario': scenario.generated_scenario,
            'video_filename': scenario.video_filename,
            'timestamp': scenario.timestamp
        } for scenario in scenarios
    ]
    return jsonify(scenarios_list)


@app.route('/admin/users', methods=['GET'])
@login_required
def get_users():
    if not current_user.admin:
        return jsonify({'message': 'Access denied: Admins only'}), 403
    users = User.query.all()
    users_list = [{'id': user.id, 'username': user.username, 'email': user.email, 'admin': user.admin} for user in users]
    return jsonify(users_list)

@app.route('/admin/users/<int:user_id>/admin', methods=['PUT'])
@login_required
def update_user_admin_status(user_id):
    if not current_user.admin:
        return jsonify({'message': 'Access denied: Admins only'}), 403
    user = User.query.get(user_id)
    if user:
        user.admin = not user.admin  # Toggle admin status
        db.session.commit()
        return jsonify({'message': 'User admin status updated'})
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if not current_user.admin:
        return jsonify({'message': 'Access denied: Admins only'}), 403
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'})
    else:
        return jsonify({'message': 'User not found'}), 404
@app.route('/admin/scenarios', methods=['GET'])
@login_required
def get_scenarios():
    if not current_user.admin:
        return jsonify({'message': 'Access denied: Admins only'}), 403
    scenarios = Scenario.query.all()
    scenarios_list = [
        {
            'id': scenario.id,
            'user_id': scenario.user_id,
            'user_input': scenario.user_input,
            'generated_scenario': scenario.generated_scenario,
            'video_filename': scenario.video_filename,
            'timestamp': scenario.timestamp
        } for scenario in scenarios
    ]
    return jsonify(scenarios_list)

@app.route('/branding', methods=['POST'])
@login_required
def generate_branding():
    data = request.get_json()
    subject = data.get('subject', '')
    vision = generate_vision(subject)
    # print(vision)
    # vision = vision.split(',')
    
    # story = generate_story(subject)
    values = generate_values(subject)
    values = values.split(',')

    # jsondict = json.loads(data)
    # value_key = list(values.keys())[0]
    # print(values('value_key'))
    colors = generate_colors(subject)
    print(colors)
    colors=colors.split(',')
    philosophy = generate_philosophy(subject)
    strategy = generate_strategy(subject)
    get_brand(subject)
    # Simulate branding elements generation
    branding_elements = {
        'logo_url': f'./images/brand.jpg',
        'color_palette': colors,
        # 'brand_story': story,
        'values': values,
        'vision': vision,
        'philosophy': philosophy,
        'marketing_strategy': [strategy
        ]
    }
    
    return jsonify({'subject': subject, 'branding_elements': branding_elements})
@app.route('/images/<filename>')
def get_logo(filename):
    return send_from_directory('images', filename)
@app.route('/videos/<filename>',  methods=['GET'])
def get_videos(filename):
    print("filename")
    print("ADSFADSF")
    return send_from_directory('videos', filename)

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
