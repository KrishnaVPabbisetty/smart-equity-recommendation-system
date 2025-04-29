# routes/trading_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from routes.user_routes import get_current_user
from models.user import User
import requests
from typing import List
from pydantic import BaseModel

router = APIRouter()

ALPACA_BASE_URL = "https://paper-api.alpaca.markets"  # Paper trading environment


# Helper function to get Alpaca headers
def get_alpaca_headers(user: User):
    return {
        "APCA-API-KEY-ID": user.alpaca_api_key,
        "APCA-API-SECRET-KEY": user.alpaca_secret_key,
    }


@router.get("/user/portfolio")
def get_portfolio(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    url = f"{ALPACA_BASE_URL}/v2/positions"
    headers = get_alpaca_headers(current_user)

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch portfolio")

    return response.json()


class BuyStockRequest(BaseModel):
    symbol: str
    qty: float
    side: str = "buy"
    type: str = "market"
    limit_price: float = None
    time_in_force: str = "gtc"


@router.post("/user/buy_stock")
def buy_stock(
    order: BuyStockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = f"{ALPACA_BASE_URL}/v2/orders"
    headers = get_alpaca_headers(current_user)

    order_data = {
        "symbol": order.symbol,
        "qty": order.qty,
        "side": order.side,
        "type": order.type,
        "time_in_force": order.time_in_force,
    }
    if order.type == "limit" and order.limit_price:
        order_data["limit_price"] = order.limit_price

    response = requests.post(url, json=order_data, headers=headers)

    if response.status_code != 200:
        alpaca_error = response.json()
        raise HTTPException(
            status_code=response.status_code,
            detail=alpaca_error.get("message", "Unknown error from Alpaca"),
        )

    return response.json()


class SellStockRequest(BaseModel):
    symbol: str
    qty: float
    side: str = "sell"
    type: str = "market"
    limit_price: float = None
    time_in_force: str = "gtc"


@router.post("/user/sell_stock")
def sell_stock(
    order: SellStockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = f"{ALPACA_BASE_URL}/v2/orders"
    headers = get_alpaca_headers(current_user)

    order_data = {
        "symbol": order.symbol,
        "qty": order.qty,
        "side": order.side,
        "type": order.type,
        "time_in_force": order.time_in_force,
    }
    if order.type == "limit" and order.limit_price:
        order_data["limit_price"] = order.limit_price

    response = requests.post(url, json=order_data, headers=headers)

    if response.status_code != 200:
      alpaca_error = response.json()
      raise HTTPException(
          status_code=response.status_code,
          detail=alpaca_error.get("message", "Unknown error from Alpaca")
      )

    return response.json()
