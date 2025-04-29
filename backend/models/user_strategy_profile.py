from sqlalchemy import Column, String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime


class UserStrategyProfile(Base):
    __tablename__ = "user_strategy_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    investment_strategy_id = Column(String, ForeignKey("investment_strategies.id"))
    customized_parameters = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="user_strategy_profiles")
    strategy = relationship("InvestmentStrategy", backref="user_strategy_profiles")
