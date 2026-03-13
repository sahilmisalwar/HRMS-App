from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app import models, auth
import os

models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if admin exists
    admin_email = "admin@hrms.com"
    existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    
    if not existing_admin:
        print("Creating default admin user...")
        hashed_password = auth.get_password_hash("admin123")
        admin = models.User(
            email=admin_email,
            full_name="System Administrator",
            hashed_password=hashed_password,
            role=models.UserRole.HR_ADMIN
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"Admin User created: {admin_email} / admin123")
    else:
        print("Admin user already exists.")

    # Create dummy candidates if empty
    if db.query(models.Candidate).count() == 0:
        print("Creating example candidates...")
        candidates = [
            models.Candidate(full_name="Alice Johnson", email="alice@example.com", phone="123-456-7890", position="Frontend Developer", status=models.CandidateStatus.APPLIED, notes="Strong React skills."),
            models.Candidate(full_name="Bob Smith", email="bob@example.com", phone="987-654-3210", position="Backend Engineer", status=models.CandidateStatus.INTERVIEWED, notes="Good knowledge of FastAPI."),
            models.Candidate(full_name="Charlie Brown", email="charlie@example.com", phone="555-555-5555", position="Product Manager", status=models.CandidateStatus.OFFERED, notes="Excellent communication."),
            models.Candidate(full_name="Diana Prince", email="diana@example.com", phone="111-222-3333", position="UX Designer", status=models.CandidateStatus.ONBOARDED, notes="Great portfolio.")
        ]
        db.add_all(candidates)
        db.commit()
        print("Example candidates created.")
    else:
        print("Candidates already exist.")

    db.close()

if __name__ == "__main__":
    seed_data()
