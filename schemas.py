# schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    is_admin: bool = False #Default is False unless explicitly set

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class DocumentOut(BaseModel):
    id: int
    filename: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        orm_mode: True
