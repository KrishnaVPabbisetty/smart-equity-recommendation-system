from sqlalchemy import Integer, Column, String, Boolean, DateTime
from datetime import datetime
from .base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    alpaca_api_key = Column(String, nullable=False)
    alpaca_secret_key = Column(String, nullable=False)
    is_trading_enabled = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    risk_tolerance = Column(String, nullable=True)
    investment_style = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
