import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, auth, crud, database, offer_letter

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HRMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/api/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/api/candidates", response_model=List[schemas.CandidateResponse])
def read_candidates(skip: int = 0, limit: int = 100, status: str = None, search: str = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_candidates(db, skip=skip, limit=limit, status=status, search=search)

@app.post("/api/candidates", response_model=schemas.CandidateResponse)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.require_hr_admin)):
    return crud.create_candidate(db, candidate)

@app.get("/api/candidates/{candidate_id}", response_model=schemas.CandidateResponse)
def read_candidate(candidate_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_candidate = crud.get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@app.put("/api/candidates/{candidate_id}", response_model=schemas.CandidateResponse)
def update_candidate(candidate_id: int, candidate: schemas.CandidateUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.require_hr_admin)):
    db_candidate = crud.update_candidate(db, candidate_id, candidate)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@app.delete("/api/candidates/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.require_hr_admin)):
    return crud.delete_candidate(db, candidate_id)

@app.post("/api/candidates/{candidate_id}/documents")
def upload_document(
    candidate_id: int,
    file: UploadFile = File(...),
    doc_type: str = Form(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_hr_admin)
):
    db_candidate = crud.get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    file_path = os.path.join(UPLOAD_DIR, f"{candidate_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    doc_create = schemas.DocumentCreate(filename=file.filename, doc_type=doc_type, file_path=file_path, candidate_id=candidate_id)
    return crud.create_document(db, doc_create)

@app.get("/api/documents/{document_id}/download")
def download_document(document_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not db_document or not os.path.exists(db_document.file_path):
        raise HTTPException(status_code=404, detail="Document not found")
    return FileResponse(db_document.file_path, filename=db_document.filename)

@app.post("/api/candidates/{candidate_id}/generate_offer")
def generate_offer(
    candidate_id: int,
    salary: str = Form(...),
    joining_date: str = Form(...),
    manager_name: str = Form(...),
    expiration_date: str = Form(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_hr_admin)
):
    candidate = crud.get_candidate(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    filename, file_path = offer_letter.generate_offer_letter_pdf(
        candidate=candidate,
        salary=salary,
        joining_date=joining_date,
        manager_name=manager_name,
        expiration_date=expiration_date,
        hr_name=current_user.full_name,
        upload_dir=UPLOAD_DIR
    )
    
    doc_create = schemas.DocumentCreate(filename=filename, doc_type="Offer_Letter", file_path=file_path, candidate_id=candidate_id)
    crud.create_document(db, doc_create)
    crud.update_candidate(db, candidate_id, schemas.CandidateUpdate(status=models.CandidateStatus.OFFERED))
    
    return {"message": "Offer letter generated successfully", "filename": filename}

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    total = db.query(models.Candidate).count()
    applied = db.query(models.Candidate).filter(models.Candidate.status == models.CandidateStatus.APPLIED).count()
    interviewed = db.query(models.Candidate).filter(models.Candidate.status == models.CandidateStatus.INTERVIEWED).count()
    offered = db.query(models.Candidate).filter(models.Candidate.status == models.CandidateStatus.OFFERED).count()
    onboarded = db.query(models.Candidate).filter(models.Candidate.status == models.CandidateStatus.ONBOARDED).count()
    
    recent_candidates = db.query(models.Candidate).order_by(models.Candidate.created_at.desc()).limit(5).all()
    
    return {
        "total_candidates": total,
        "applied": applied,
        "interviewed": interviewed,
        "offered": offered,
        "onboarded": onboarded,
        "recent": [{"id": c.id, "full_name": c.full_name, "position": c.position, "status": c.status.value, "created_at": c.created_at} for c in recent_candidates]
    }
