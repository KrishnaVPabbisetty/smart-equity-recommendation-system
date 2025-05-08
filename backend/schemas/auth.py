from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str
    is_admin: bool


class TokenData(BaseModel):
    email: Optional[str] = None  # Or username if preferred
