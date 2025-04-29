from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    password: str
    alpaca_api_key: str
    alpaca_secret_key: str
    risk_tolerance: Optional[str] = None
    investment_style: Optional[str] = None
    is_admin: Optional[bool] = False


class UserUpdate(BaseModel):
    username: Optional[str] = None
    risk_tolerance: Optional[str] = None
    investment_style: Optional[str] = None
    is_trading_enabled: Optional[bool] = None


class UserOut(BaseModel):
    id: str
    email: EmailStr
    username: Optional[str]
    is_admin: bool
    is_trading_enabled: bool
    risk_tolerance: Optional[str]
    investment_style: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
