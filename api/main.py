# main.py



from models import Base
from fastapi import FastAPI, HTTPException, Depends, Query
from database import engine
from routes import games,players,tournaments, sessions
from fastapi.middleware.cors import CORSMiddleware  # Import this

app = FastAPI()


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
