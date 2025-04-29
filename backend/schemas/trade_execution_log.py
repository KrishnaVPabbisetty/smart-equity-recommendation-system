from pydantic import BaseModel
from datetime import datetime


class TradeExecutionLogCreate(BaseModel):
    user_id: str
    symbol: str
    action: str  # BUY or SELL
    quantity: float
    price_executed: float
    recommendation_reason: str


class TradeExecutionLogOut(BaseModel):
    id: str
    user_id: str
    symbol: str
    action: str
    quantity: float
    price_executed: float
    recommendation_reason: str
    timestamp: datetime

    class Config:
        orm_mode = True
