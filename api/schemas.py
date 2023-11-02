from pydantic import BaseModel, constr, validator
from typing import List, Union
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID 


# Pydantic models

#Games
class GameBase(BaseModel):
    winnerTeam: List[Optional[str]]
    loserTeam: List[Optional[str]]

    class Config:
        orm_mode = True

class GameCreate(GameBase):
    pass

class GameOut(GameCreate):
    id: UUID
    createdAt: datetime


# Player
class PlayerBase(BaseModel):
    name: str
    animal: str
    isRetired: Optional[bool] = False

class PlayerCreate(PlayerBase):
    pass

class PlayerOut(PlayerBase):
    id: str

    class Config:
        orm_mode = True

# Tournament
class TournamentBase(BaseModel):
    wagerPercentage: float
    players: List[str]
    first: str  # These might need further breakdown if TournamentTeam has more attributes.
    second: str
    third: str

class TournamentCreate(TournamentBase):
    pass  # Since the creation schema is the same as the base schema in this case.

class TournamentOut(TournamentBase):
    id: str
    createdAt: datetime