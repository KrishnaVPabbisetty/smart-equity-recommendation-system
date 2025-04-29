from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from .base import Base
from datetime import datetime


class TradeExecutionLog(Base):
    __tablename__ = "trade_execution_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    symbol = Column(String)
    action = Column(String)
    quantity = Column(Float)
    price_executed = Column(Float)
    recommendation_reason = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
