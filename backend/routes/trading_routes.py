# routes/trading_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.trade import OrderType, Side
from db import get_db
from routes.user_routes import get_current_user
from models.user import User
import requests
from typing import List, Optional
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
    headers = get_alpaca_headers(current_user)

    # Fetch account details
    account_response = requests.get(f"{ALPACA_BASE_URL}/v2/account", headers=headers)
    if account_response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch account: {account_response.json().get('message', 'Unknown error')}",
        )
    account_data = account_response.json()

    # Fetch positions
    positions_response = requests.get(
        f"{ALPACA_BASE_URL}/v2/positions", headers=headers
    )
    if positions_response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch positions: {positions_response.json().get('message', 'Unknown error')}",
        )
    positions_data = positions_response.json()

    # Return combined response
    return {
        "buying_power": account_data.get("buying_power"),
        "equity": account_data.get("equity"),
        "portfolio_value": account_data.get("portfolio_value"),
        "cash": account_data.get("cash"),
        "positions": positions_data,
    }


@router.get("/user/orders")
def get_orders(
    status: str = "open",
    limit: int = 50,
    after: Optional[str] = None,
    until: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = f"{ALPACA_BASE_URL}/v2/orders"
    headers = {
        "APCA-API-KEY-ID": current_user.alpaca_api_key,
        "APCA-API-SECRET-KEY": current_user.alpaca_secret_key,
    }
    params = {
        "status": status,
        "limit": min(limit, 100),  # enforce Alpaca limit
    }
    if after:
        params["after"] = after
    if until:
        params["until"] = until

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch orders: {response.json().get('message', 'Unknown error')}",
        )

    return response.json()


class BuyStockRequest(BaseModel):
    symbol: str
    qty: float
    type: OrderType
    side: Side
    time_in_force: str
    limit_price: float | None = None
    stop_price: float | None = None


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
    type: OrderType
    side: Side
    time_in_force: str
    limit_price: float | None = None
    stop_price: float | None = None


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
            detail=alpaca_error.get("message", "Unknown error from Alpaca"),
        )

    return response.json()
