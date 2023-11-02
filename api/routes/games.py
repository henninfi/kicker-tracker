from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import GameCreate,GameOut
from models import Game
from database import get_db
from typing import List
import json


router = APIRouter()

@router.post("/")
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    try:
        # If the inputs are list-like, convert them to string
        winner_team_str = json.dumps(game.winnerTeam) if isinstance(game.winnerTeam, list) else game.winnerTeam
        loser_team_str = json.dumps(game.loserTeam) if isinstance(game.loserTeam, list) else game.loserTeam
    except TypeError as e:
        # If there's an error in conversion, it means the data was not serializable.
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")

    # Create the Game object with the string representations
    db_game = Game(winnerTeam=winner_team_str, loserTeam=loser_team_str)
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

@router.get("/")
def list_games(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    print(games)
    return games
