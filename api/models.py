#New
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from uuid import uuid4
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY

Base = declarative_base()

class Game(Base):
    __tablename__ = 'games'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    createdAt = Column(DateTime, default=datetime.utcnow)
    winnerTeam = Column(String)
    loserTeam = Column(String)


class Player(Base):
    __tablename__ = "players"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    animal = Column(String, index=True)
    isRetired = Column(Boolean, default=False)

class Tournament(Base):
    __tablename__ = 'tournaments'
    
    id = Column(String, primary_key=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    wagerPercentage = Column(Float)
    players = Column(ARRAY(String))
    first = Column(String) # This should be updated based on the TournamentTeam structure
    second = Column(String)
    third = Column(String)
