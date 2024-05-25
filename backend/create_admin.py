from app import app, db
from models import User

def reset_database():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        print("All tables dropped.")
        
        # Create all tables
        db.create_all()
        print("All tables created.")
        
        # Add the admin user
        admin_user = User(username='admin', email='admin@admin.com', password='1234', admin=True)
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created.")

if __name__ == '__main__':
    reset_database()
