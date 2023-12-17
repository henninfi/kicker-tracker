from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from schemas import PlayerCreate, PlayerOut
from models import Player, Session as SessionModel, SessionPlayer
from database import get_db
from typing import List
from uuid import UUID 
from routes.auth import auth
from fief_client import FiefUserInfo


router = APIRouter()

@router.post("/", response_model=PlayerOut)
def create_player(
    player: PlayerCreate, 
    user: FiefUserInfo = Depends(auth.current_user()),
    db: Session = Depends(get_db)
    ):
    # Create a new player
    db_player = Player(id=UUID(user["sub"]), name=player.name, animal=player.animal, isRetired=player.isRetired, isSession_player = False)
    db.add(db_player)       
    db.commit()
    db.refresh(db_player)

    return db_player

@router.post("/{session_id}", response_model=PlayerOut)
def create_player_in_session(
    session_id: UUID, 
    player: PlayerCreate, 
    user: FiefUserInfo = Depends(auth.current_user()),
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
    user: FiefUserInfo = Depends(auth.current_user()),
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
    user: FiefUserInfo = Depends(auth.current_user()),
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
    user: FiefUserInfo = Depends(auth.current_user()),
    db: Session = Depends(get_db)):
    players = db.query(Player).all()
    return players

@router.get("/{session_id}", response_model=List[PlayerOut])
def list_players_by_session(
    session_id: UUID, 
    user: FiefUserInfo = Depends(auth.current_user()),
    db: Session = Depends(get_db)
):
    # Query for the session first to check if it exists
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Fetch players associated with the session
    players = [sp.player for sp in session.players]

    # Transform players to PlayerOut models
    player_out_list = [PlayerOut(**player.__dict__) for player in players]

    return player_out_list


