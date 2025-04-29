from sqlalchemy import Column, String, JSON
from .base import Base


class InvestmentStrategy(Base):
    __tablename__ = "investment_strategies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    default_parameters = Column(JSON)
