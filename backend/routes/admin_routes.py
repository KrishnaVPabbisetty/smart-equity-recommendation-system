# routes/admin_routes.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
from db import get_db
from models import User, Document
from auth import get_user
from fastapi.security import OAuth2PasswordBearer
from config import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from datetime import datetime

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_current_admin(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user(db, username)
        if not user or not user.is_admin:
            raise HTTPException(status_code=403, detail="Not authorized as admin")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/admin/dashboard")
def upload_document(
    current_admin: User = Depends(get_current_admin)
):
    return  {"message": f"Welcome to your admin dashboard, {current_admin.username}!"}


@router.post("/admin/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filepath, "wb") as f:
        f.write(file.file.read())

    document = Document(
        filename=file.filename,
        uploaded_by=current_admin.id,
        uploaded_at=datetime.utcnow()
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    return {"message": f"'{file.filename}' uploaded successfully and recorded."}
