# routes/tournaments.py
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
import uuid
from schemas import TournamentCreate, TournamentOut
from models import Tournament
from database import get_db
from typing import List
from routes.auth import auth
from fief_client import FiefUserInfo
from propelauth_py.user import User

router = APIRouter()

@router.post("/", response_model=TournamentOut)
def create_tournament(
    tournament: TournamentCreate, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)
    ):

    db_tournament = Tournament(
        id=str(uuid.uuid4()),
        wagerPercentage=tournament.wagerPercentage,
        players=tournament.players,
        first=tournament.first,
        second=tournament.second,
        third=tournament.third
    )
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament

@router.delete("/{tournament_id}", response_model=dict)
def delete_tournament(
    tournament_id: str, 
    user: User = Depends(auth.require_user),
    db: Session = Depends(get_db)):
    db_tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not db_tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    db.delete(db_tournament)
    db.commit()
    return {"status": "success"}

@router.get("/", response_model=List[TournamentOut])
def list_tournaments(
    db: Session = Depends(get_db),
    user: User = Depends(auth.require_user)):
    tournaments = db.query(Tournament).all()
    return tournaments
