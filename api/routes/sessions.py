from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import SessionBase, SessionCreate, SessionOut
from models import Session as SessionModel
from database import get_db
from typing import List
import json
from uuid import UUID


router = APIRouter()

# Endpoint to create a new session
@router.post("/", response_model=SessionOut)
def create_session(session: SessionCreate, db: Session = Depends(get_db)):
    db_session = SessionModel(session_type=session.session_type, end_date=session.end_date)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return SessionOut(**db_session.__dict__)

# Endpoint to get a session by ID
@router.get("/sessions_id/{session_id}", response_model=SessionCreate)
def read_session(session_id: UUID, db: Session = Depends(get_db)):
    db_session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if db_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session