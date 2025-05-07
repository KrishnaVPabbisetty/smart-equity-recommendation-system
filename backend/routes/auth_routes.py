# routes/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from db import get_db
from schemas.user import UserCreate
from schemas.auth import Token

# from schemas import UserCreate, Token
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_user,
)
from models.user import User

router = APIRouter()


# @router.post("/signup")
# def signup(user: UserCreate, db: Session = Depends(get_db)):
#     if get_user(db, user.username):
#         raise HTTPException(status_code=400, detail="Username already registered")
#     # hashed_password = get_password_hash(user.password)
#     hashed_password = user.password #For Local testing
#     db_user = User(
#         username=user.username, hashed_password=hashed_password, is_admin=user.is_admin
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return {"message": "User created successfully"}


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if get_user(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(user.password)
    # hashed_password = user.password  # For local testing

    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        alpaca_api_key=user.alpaca_api_key,
        alpaca_secret_key=user.alpaca_secret_key,
        is_trading_enabled=True,
        is_admin=user.is_admin,
        risk_tolerance=user.risk_tolerance,
        investment_style=user.investment_style,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}


@router.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    print(form_data.username)
    print(form_data.password)
    print(user.is_admin)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    is_admin=user.is_admin
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer", is_admin=is_admin)
