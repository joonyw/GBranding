from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    admin = db.Column(db.Boolean, default=False)

    def __init__(self, username, email, password, admin=False):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.admin = admin

class Scenario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_input = db.Column(db.String(500), nullable=False)
    generated_scenario = db.Column(db.String(2000), nullable=False)
    video_filename = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('scenarios', lazy=True))

class Branding(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scenario_id = db.Column(db.Integer, db.ForeignKey('scenario.id'), nullable=False)
    logo_url = db.Column(db.String(500), nullable=False)
    color_palette = db.Column(db.String(1000), nullable=False)
    brand_story = db.Column(db.String(2000), nullable=False)
    values = db.Column(db.String(1000), nullable=False)
    vision = db.Column(db.String(1000), nullable=False)
    philosophy = db.Column(db.String(1000), nullable=False)
    marketing_strategy = db.Column(db.String(2000), nullable=False)

    scenario = db.relationship('Scenario', backref=db.backref('branding', uselist=False))
