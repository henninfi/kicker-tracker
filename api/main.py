# main.py



from models import Base
from fastapi import FastAPI, Depends
from database import engine
from routes import sessions, games, players, tournaments
from fastapi.middleware.cors import CORSMiddleware  # Import this
from propelauth_fastapi import init_auth
from propelauth_py.user import User

from fastapi import FastAPI


from typing import Dict, Optional
import uuid

app = FastAPI()

auth = init_auth("https://046425272.propelauthtest.com", "bbddd842b0cec6f0c787e97b915ce786495330bb6b3f8f8b838e5183ef2e8055ec776de721b94bd641b918acec523bb4")


def init_db():
    # Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

# Initialize the database
init_db()

# Add CORS middleware settings
origins = [
    "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001" 
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router, prefix="/games", tags=["games"])
app.include_router(players.router, prefix="/players", tags=["players"])
app.include_router(tournaments.router, prefix="/tournaments", tags=["tournaments"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
# app.include_router(auth.router, prefix="/auth", tags=["auth"])
