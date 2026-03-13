from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_candidates(db: Session, skip: int = 0, limit: int = 100, status: str = None, search: str = None):
    query = db.query(models.Candidate)
    if status:
        query = query.filter(models.Candidate.status == status)
    if search:
        query = query.filter(models.Candidate.full_name.ilike(f"%{search}%") | models.Candidate.email.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()

def get_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

def create_candidate(db: Session, candidate: schemas.CandidateCreate):
    db_candidate = models.Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def update_candidate(db: Session, candidate_id: int, candidate_update: schemas.CandidateUpdate):
    db_candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if db_candidate:
        update_data = candidate_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_candidate, key, value)
        db.commit()
        db.refresh(db_candidate)
    return db_candidate

def delete_candidate(db: Session, candidate_id: int):
    db_candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if db_candidate:
        db.delete(db_candidate)
        db.commit()
    return db_candidate

def create_document(db: Session, document: schemas.DocumentCreate):
    db_document = models.Document(**document.model_dump())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def delete_document(db: Session, document_id: int):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document:
        db.delete(db_document)
        db.commit()
    return db_document
