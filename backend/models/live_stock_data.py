from sqlalchemy import Integer, Column, String, Float, DateTime
from .base import Base
from datetime import datetime


class LiveStockData(Base):
    __tablename__ = "live_stock_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    symbol = Column(String, index=True)
    price = Column(Float)
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    volume = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
