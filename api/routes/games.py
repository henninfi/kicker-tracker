from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import GameCreate,GameOut
from models import Game
from database import get_db
from typing import List


router = APIRouter()

@router.post("/", response_model=GameOut)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    db_game = Game(winnerTeam=game.winnerTeam, loserTeam=game.loserTeam)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

@router.delete("/{game_id}", response_model=dict)
def delete_game(game_id: str, db: Session = Depends(get_db)):
    db_game = db.query(Game).filter(Game.id == game_id).first()
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")
    db.delete(db_game)
    db.commit()
    return {"status": "success"}

@router.get("/", response_model=List[GameOut])
def list_games(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    return games
