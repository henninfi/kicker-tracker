from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from schemas import GameCreate
from models import Game, Session as SessionModel
from database import get_db
from typing import List
import json
from uuid import UUID
from routes.auth import auth
from fief_client import FiefUserInfo
from propelauth_py.user import User


router = APIRouter()

@router.post("/{session_id}")
def create_game(
    session_id: UUID, 
    game: GameCreate, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

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

    # If a session_id is provided, associate the game with the session
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session:
        session.games.append(db_game)
    else:
        raise HTTPException(status_code=404, detail="Session not found")

    db.commit()
    db.refresh(db_game)
    return db_game

@router.delete("/{game_id}", response_model=dict)
def delete_game(
    game_id: str, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

    db_game = db.query(Game).filter(Game.id == game_id).first()
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")
    db.delete(db_game)
    db.commit()
    return {"status": "success"}

@router.get("/")
def list_games(
    user: User = Depends(auth.require_user), 
    db: Session = Depends(get_db)
    ):
    games = db.query(Game).all()
    print(games)
    return games

@router.get("/{session_id}")
def list_games_by_session(
    session_id: str,  # Assuming session_id is a string UUID
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
):
    # Query for the session first to check if it exists
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Use the 'games' relationship in the Session model to get games
    games = session.games

    return games