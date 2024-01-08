from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import SessionBase, SessionCreate, SessionOut
from models import Session as SessionModel, SessionPlayer
from database import get_db
from typing import List
import json
from uuid import UUID
from routes.auth import auth
from fief_client import FiefUserInfo
from sqlalchemy.orm import joinedload
from propelauth_fastapi import init_auth
from propelauth_py.user import User

router = APIRouter()



# Endpoint to create a new session
@router.post("/", response_model=SessionOut)
def create_session(
    session: SessionCreate, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

    db_session = SessionModel(session_type=session.session_type, end_date=session.end_date, name=session.name, description=session.description)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    db_session = SessionOut(**db_session.__dict__)

    # # Create a session-player association with the user as admin
    session_player_admin = SessionPlayer(session_id=db_session.id, player_id=user.user_id, role="admin")
    db.add(session_player_admin)
    db.commit()

    
    return db_session


# Endpoint to get a session by ID
@router.get("/sessions_id/{session_id}", response_model=SessionOut)
def read_session(
    session_id: UUID, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

    session = db.query(SessionModel)\
                 .join(SessionPlayer)\
                 .filter(SessionModel.id == session_id)\
                 .filter(SessionPlayer.player_id == user.user_id)\
                 .options(joinedload(SessionModel.players))\
                 .first()
    
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Find admin IDs for this session
    admin_ids = [player.player_id for player in session.players if player.role == 'admin']
    user_ids = [player.player_id for player in session.players if player.role == 'user']
    viewer_ids = [player.player_id for player in session.players if player.role == 'viewer']
    
    # Transform the session instance to SessionOut schema and include admin_ids
    session_data = SessionOut(**session.__dict__, admin_ids=admin_ids, user_ids=user_ids, viewer_ids=viewer_ids)

    return session_data

@router.get("/user-sessions/", response_model=List[SessionOut])
def get_user_sessions(
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint to get all sessions for the current user.
    It uses the user ID from FiefUserInfo to query the SessionPlayer table 
    and retrieve all sessions where the current user is a participant.
    """

    # Querying the SessionPlayer table for sessions where the current user is a participant
    sessions = db.query(SessionModel)\
                 .join(SessionPlayer)\
                 .filter(SessionPlayer.player_id == user.user_id)\
                 .options(joinedload(SessionModel.players))\
                 .all()

    if not sessions:
        return []
    

    # # Transforming the model instances to SessionOut schema
    session_outputs = [SessionOut(**session.__dict__) for session in sessions]
    
    return session_outputs