from pydantic import BaseModel
from datetime import datetime


class DocumentOut(BaseModel):
    id: int
    filename: str
    uploaded_by: int
    created_at: datetime

    class Config:
        orm_mode = True
