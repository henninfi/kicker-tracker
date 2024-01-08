from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from schemas import PlayerCreate, PlayerOut
from models import Player, Session as SessionModel, SessionPlayer
from database import get_db
from typing import List, Union
from uuid import UUID 
from routes.auth import auth
from fief_client import FiefUserInfo
from propelauth_py.user import User



router = APIRouter()

@router.post("/", response_model=PlayerOut)
def create_player(
    player: PlayerCreate, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):
    # Create a new player
    db_player = Player(id=UUID(user.user_id), name=player.name, animal=player.animal, isRetired=player.isRetired, isSession_player = False)
    db.add(db_player)       
    db.commit()
    db.refresh(db_player)

    return db_player

@router.post("/{session_id}", response_model=PlayerOut)
def create_player_in_session(
    session_id: UUID, 
    player: PlayerCreate, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):
    # Create a new player
    db_player = Player(name=player.name, animal=player.animal, isRetired=player.isRetired)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)

    # Fetch the session
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session:
        # Properly associate player with session
        session_player_association = SessionPlayer(session_id=session.id, player_id=db_player.id)
        db.add(session_player_association)
    else:
        raise HTTPException(status_code=404, detail="Session not found")
        
    db.commit()
    db.refresh(db_player)

    return db_player

@router.put("/{player_id}", response_model=PlayerOut)
def update_player(
    player_id: str, 
    player: PlayerCreate, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Update fields
    db_player.name = player.name
    db_player.animal = player.animal
    db_player.isRetired = player.isRetired
    
    db.commit()
    db.refresh(db_player)
    return db_player


@router.delete("/{player_id}", response_model=dict)
def delete_player(
    player_id: str, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    db.delete(db_player)
    db.commit()
    return {"status": "success"}

@router.get("/", response_model=List[PlayerOut])
def list_players(
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)):
    players = db.query(Player).all()
    return players

@router.get("/get_current_player", response_model=Union[PlayerOut, bool])
def get_current_player(
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
):
    player = db.query(Player).filter(Player.id == user.user_id).first()
    if player:
        return player  # Assuming player is a valid dictionary or object
    else:
        return False

@router.get("/{session_id}", response_model=List[PlayerOut])
def list_players_by_session(
    session_id: UUID, 
    session_type: str = None, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db),

):
    # Query for the session first to check if it exists
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Fetch players associated with the session
    players = [sp.player for sp in session.players]

    # Depending on session type
    if session_type == 'ranked':
        # Transform players to PlayerOut models
        return [PlayerOut(**player.__dict__) for player in players if player.isSession_player]
        
    
    else:
        # Transform players to PlayerOut models
        # Assuming PlayerOut is a class that takes keyword arguments.
        
        return [PlayerOut(**player.__dict__) for player in players]




