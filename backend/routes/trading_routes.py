# routes/trading_routes.py
from fastapi import APIRouter, Depends, HTTPException, status,Query
from sqlalchemy.orm import Session
from schemas.trade import OrderType, Side
from db import get_db
from routes.user_routes import get_current_user
from models.user import User
import requests
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


router = APIRouter()

ALPACA_BASE_URL = "https://paper-api.alpaca.markets"  # Paper trading environment

ALPACA_NEWS_URL = "https://data.alpaca.markets/v1beta1/news"

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

@router.get("/user/news")
def get_today_news(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: Optional[int] = 50
):
    def isoformat_z(dt):
        return dt.replace(microsecond=0).isoformat() + "Z"

    start_of_day = isoformat_z(datetime.utcnow().replace(hour=0, minute=0, second=0))
    end_of_day = isoformat_z(datetime.utcnow())

    params = {
        "start": start_of_day,
        "end": end_of_day,
        "limit": limit,
    }

    headers = get_alpaca_headers(current_user)

    try:
        response = requests.get(ALPACA_NEWS_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()["news"]
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/watchlist")
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = f"{ALPACA_BASE_URL}/v2/watchlists:by_name"
    headers = get_alpaca_headers(current_user)
    params = {"name": "default"}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 404:
        return {"assets": []}  # No watchlist exists yet
    response.raise_for_status()
    return response.json()

from pydantic import BaseModel
from typing import List

class WatchlistUpdate(BaseModel):
    symbols: List[str]

@router.post("/user/watchlist")
def create_or_update_watchlist(
    body: WatchlistUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = f"{ALPACA_BASE_URL}/v2/watchlists:by_name"
    headers = get_alpaca_headers(current_user)
    params = {"name": "default"}
    
    # Attempt to update if watchlist exists
    check = requests.get(url, headers=headers, params=params)
    if check.status_code == 200:
        watchlist_id = check.json()["id"]
        response = requests.put(
            f"{ALPACA_BASE_URL}/v2/watchlists/{watchlist_id}",
            headers=headers,
            json={"name": "default", "symbols": body.symbols}
        )
    else:
        response = requests.post(
            f"{ALPACA_BASE_URL}/v2/watchlists",
            headers=headers,
            json={"name": "default", "symbols": body.symbols}
        )

    response.raise_for_status()
    return response.json()

@router.delete("/user/watchlist/{symbol}")
def remove_from_watchlist(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get the watchlist ID
    url = f"{ALPACA_BASE_URL}/v2/watchlists:by_name"
    headers = get_alpaca_headers(current_user)
    params = {"name": "default"}

    res = requests.get(url, headers=headers, params=params)
    if res.status_code != 200:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    watchlist_id = res.json()["id"]

    # Delete the symbol
    del_url = f"{ALPACA_BASE_URL}/v2/watchlists/{watchlist_id}/{symbol}"
    del_response = requests.delete(del_url, headers=headers)
    del_response.raise_for_status()
    return {"message": f"{symbol} removed from watchlist"}

@router.get("/user/prices")
def get_latest_prices(
    symbols: str = Query(...),  # <-- Explicitly treat as query param
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    
    prices = []
    for symbol in symbol_list:
        url = f"https://data.alpaca.markets/v2/stocks/{symbol}/quotes/latest"
        headers = get_alpaca_headers(current_user)

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            continue

        data = response.json()
        price = round(data.get("quote", {}).get("ap", 0), 2)
        print(f"{symbol} price: {price}")
        prices.append({
            "symbol": symbol,
            "price": float(f"{price:.2f}"),
            "change_percent": 0  # Placeholder
        })

    return prices