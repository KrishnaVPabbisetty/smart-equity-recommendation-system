# init_db.py
from db import engine
from models.base import Base

def init():
    Base.metadata.create_all(bind=engine)
