
from app import app
from models import db


# Create the database and the database tables within the application context
# @app.before_first_request()
with app.app_context():
    db.create_all()