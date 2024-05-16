
from app import app, db, User

# Create the database and the database tables within the application context
with app.app_context():
    db.create_all()