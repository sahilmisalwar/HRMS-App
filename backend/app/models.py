from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserRole(str, enum.Enum):
    HR_ADMIN = "HR_ADMIN"
    MANAGER = "MANAGER"

class CandidateStatus(str, enum.Enum):
    APPLIED = "Applied"
    INTERVIEWED = "Interviewed"
    OFFERED = "Offered"
    ONBOARDED = "Onboarded"
    REJECTED = "Rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.HR_ADMIN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    position = Column(String)
    status = Column(Enum(CandidateStatus), default=CandidateStatus.APPLIED)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    documents = relationship("Document", back_populates="candidate", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    filename = Column(String)
    file_path = Column(String)
    doc_type = Column(String) # Resume, ID_Proof, Offer_Letter, Certificate
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("Candidate", back_populates="documents")
