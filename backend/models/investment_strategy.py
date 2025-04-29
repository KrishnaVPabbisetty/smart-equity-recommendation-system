from sqlalchemy import Integer, Column, String, JSON
from .base import Base


class InvestmentStrategy(Base):
    __tablename__ = "investment_strategies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    default_parameters = Column(JSON)
