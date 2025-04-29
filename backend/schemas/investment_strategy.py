from pydantic import BaseModel
from typing import Optional, Dict


class InvestmentStrategyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    default_parameters: Optional[Dict] = None


class InvestmentStrategyOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    default_parameters: Optional[Dict]

    class Config:
        orm_mode = True
