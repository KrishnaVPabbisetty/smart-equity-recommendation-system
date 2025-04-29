# routes/healthcheck.py
from fastapi import APIRouter
import os

router = APIRouter()

DB_FILE_PATH = "./test.db"  # adjust if your DB is in a different path


@router.get("/healthcheck")
def healthcheck():
    db_exists = os.path.exists(DB_FILE_PATH)
    return {"status": "ok", "database_exists": db_exists}
