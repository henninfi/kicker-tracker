from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from schemas import PlayerCreate, PlayerOut
from models import Player, Session as SessionModel
from database import get_db
from typing import List
from uuid import UUID 

router = APIRouter()

@router.post("/{session_id}", response_model=PlayerOut)
def create_player(session_id: UUID, player: PlayerCreate, db: Session = Depends(get_db)):
    db_player = Player(id=str(uuid.uuid4()), name=player.name, animal=player.animal, isRetired=player.isRetired)
    db.add(db_player)
    # If a session_id is provided, associate the player with the session
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session:
        session.players.append(db_player)
    else:
        raise HTTPException(status_code=404, detail="Session not found")
        
    db.commit()
    db.refresh(db_player)
    return db_player

@router.put("/{player_id}", response_model=PlayerOut)
def update_player(player_id: str, player: PlayerCreate, db: Session = Depends(get_db)):
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
def delete_player(player_id: str, db: Session = Depends(get_db)):
    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    db.delete(db_player)
    db.commit()
    return {"status": "success"}

@router.get("/", response_model=List[PlayerOut])
def list_players(db: Session = Depends(get_db)):
    players = db.query(Player).all()
    return players

@router.get("/{session_id}", response_model=List[PlayerOut])
def list_players_by_session(
    session_id: UUID,  # Using UUID for session_id
    db: Session = Depends(get_db)
):
    # Query for the session first to check if it exists
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Fetch players associated with the session
    players = session.players

    return players

