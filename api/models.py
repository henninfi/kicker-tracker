#New
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from uuid import uuid4
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Table
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID



Base = declarative_base()


# Association table for the many-to-many relationship between Session and Player
session_player_association = Table(
    'session_player', Base.metadata,
    Column('session_id', UUID(as_uuid=True), ForeignKey('sessions.id'), primary_key=True),
    Column('player_id', UUID(as_uuid=True), ForeignKey('players.id'), primary_key=True)
)

# Association table for the many-to-many relationship between Session and Game
session_game_association = Table(
    'session_game', Base.metadata,
    Column('session_id', UUID(as_uuid=True), ForeignKey('sessions.id'), primary_key=True),
    Column('game_id', UUID(as_uuid=True), ForeignKey('games.id'), primary_key=True)
)


class Game(Base):
    __tablename__ = 'games'
    
    id = Column(UUID, primary_key=True, default=lambda: str(uuid4()))
    createdAt = Column(DateTime, default=datetime.utcnow)
    winnerTeam = Column(String)
    loserTeam = Column(String)

    sessions = relationship("Session", secondary=session_game_association, back_populates="games")


class Player(Base):
    __tablename__ = "players"

    id = Column(UUID, primary_key=True, index=True)
    name = Column(String, index=True)
    animal = Column(String, index=True)
    isRetired = Column(Boolean, default=False)

    sessions = relationship("Session", secondary=session_player_association, back_populates="players")

class Tournament(Base):
    __tablename__ = 'tournaments'
    
    id = Column(String, primary_key=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    wagerPercentage = Column(Float)
    players = Column(ARRAY(String))
    first = Column(String) # This should be updated based on the TournamentTeam structure
    second = Column(String)
    third = Column(String)

class Session(Base):
    __tablename__ = 'sessions'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    session_type = Column(String, index=True)  # For example, 'ladder', '1-day-pass', etc.
    end_date = Column(DateTime, nullable=True)  # Optional end date

    # Setting up many-to-many relationships
    players = relationship("Player", secondary=session_player_association, back_populates="sessions")
    games = relationship("Game", secondary=session_game_association, back_populates="sessions")
