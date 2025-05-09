from sqlalchemy import Column, Integer, Float, DateTime
from .base import Base
from datetime import datetime


class PortfolioHistory(Base):
    __tablename__ = "portfolio_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # Linking it to a user
    portfolio_value = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
