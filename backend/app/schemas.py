from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole, CandidateStatus

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    role: UserRole | None = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.HR_ADMIN

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    filename: str
    doc_type: str

class DocumentCreate(DocumentBase):
    file_path: str
    candidate_id: int

class DocumentResponse(DocumentBase):
    id: int
    candidate_id: int
    file_path: str
    uploaded_at: datetime
    class Config:
        from_attributes = True

class CandidateBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    position: str
    notes: Optional[str] = None
    status: CandidateStatus = CandidateStatus.APPLIED

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[CandidateStatus] = None

class CandidateResponse(CandidateBase):
    id: int
    created_at: datetime
    documents: List[DocumentResponse] = []
    class Config:
        from_attributes = True
