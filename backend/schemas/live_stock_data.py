from pydantic import BaseModel
from datetime import datetime


class LiveStockDataCreate(BaseModel):
    symbol: str
    price: float
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: float


class LiveStockDataOut(BaseModel):
    id: str
    symbol: str
    price: float
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: float
    timestamp: datetime

    class Config:
        orm_mode = True
