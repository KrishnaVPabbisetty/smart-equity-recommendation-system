from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime


class UserStrategyProfileCreate(BaseModel):
    user_id: str
    investment_strategy_id: str
    customized_parameters: Optional[Dict] = None


class UserStrategyProfileOut(BaseModel):
    id: str
    user_id: str
    investment_strategy_id: str
    customized_parameters: Optional[Dict]
    created_at: datetime

    class Config:
        orm_mode = True
