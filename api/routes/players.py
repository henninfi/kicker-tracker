from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from schemas import PlayerCreate, PlayerOut
from models import Player
from database import get_db
from typing import List

router = APIRouter()

@router.post("/", response_model=PlayerOut)
def create_player(player: PlayerCreate, db: Session = Depends(get_db)):
    db_player = Player(id=str(uuid.uuid4()), name=player.name, animal=player.animal, isRetired=player.isRetired)
    db.add(db_player)
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
