from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models.user import User
from auth import get_user, get_token_from_ws
from config import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
import json
import requests
import websockets

router = APIRouter()

ALPACA_WS_URL = "wss://stream.data.alpaca.markets/v2/iex"


async def get_current_user_from_ws(websocket: WebSocket, db: Session) -> User:
    """
    This function retrieves the current user from WebSocket connection.
    """
    token = get_token_from_ws(websocket)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise WebSocketDisconnect(code=4001)
    except JWTError:
        raise WebSocketDisconnect(code=4001)

    user = get_user(db, username)
    if not user:
        raise WebSocketDisconnect(code=4001)
    return user


def get_watchlist_symbols(user: User):
    """
    Fetch symbols from the default watchlist for the current user.
    """
    url = "https://paper-api.alpaca.markets/v2/watchlists:by_name"
    headers = {
        "APCA-API-KEY-ID": user.alpaca_api_key,
        "APCA-API-SECRET-KEY": user.alpaca_secret_key,
    }
    response = requests.get(url, headers=headers, params={"name": "default"})

    if response.status_code == 200:
        watchlist_data = response.json()
        # Extract symbol list from the watchlist assets
        watchlist_symbols = [
            asset["symbol"] for asset in watchlist_data.get("assets", [])
        ]
        return watchlist_symbols
    else:
        raise HTTPException(status_code=400, detail="Failed to fetch watchlists")


def get_portfolio_symbols(user: User):
    """
    Fetch the portfolio symbols for the current user.
    """
    url = f"https://paper-api.alpaca.markets/v2/positions"
    headers = {
        "APCA-API-KEY-ID": user.alpaca_api_key,
        "APCA-API-SECRET-KEY": user.alpaca_secret_key,
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        positions = response.json()
        return [position["symbol"] for position in positions]
    else:
        raise HTTPException(status_code=400, detail="Failed to fetch portfolio")


@router.websocket("/ws/market")
async def market_data_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    WebSocket handler to relay live market data to the user.
    """
    await websocket.accept()

    try:
        current_user = await get_current_user_from_ws(websocket, db)

        # Fetch symbols from the user's portfolio
        portfolio_symbols = get_portfolio_symbols(current_user)

        # Fetch symbols from the user's watchlists
        watchlist_symbols = get_watchlist_symbols(current_user)

        # Combine and deduplicate symbols
        symbols = list(set(portfolio_symbols + watchlist_symbols))
        print(symbols)

        if not symbols:
            await websocket.send_text(
                "No active positions or watchlist symbols to subscribe to"
            )
            await websocket.close()
            return

        # Connect to Alpaca WebSocket
        async with websockets.connect(ALPACA_WS_URL) as alpaca_ws:
            # Authenticate
            auth_msg = {
                "action": "auth",
                "key": current_user.alpaca_api_key,
                "secret": current_user.alpaca_secret_key,
            }
            await alpaca_ws.send(json.dumps(auth_msg))
            auth_response = await alpaca_ws.recv()
            await websocket.send_text(f"Auth response: {auth_response}")

            # Subscribe to trades for the user's portfolio and watchlist
            sub_msg = {"action": "subscribe", "trades": symbols}
            await alpaca_ws.send(json.dumps(sub_msg))
            sub_response = await alpaca_ws.recv()
            await websocket.send_text(f"Subscribe response: {sub_response}")

            # Forward live trades to the frontend
            while True:
                try:
                    data = await alpaca_ws.recv()
                    await websocket.send_text(data)
                except websockets.exceptions.ConnectionClosed:
                    break

    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        await websocket.send_text(f"WebSocket error: {str(e)}")
        await websocket.close()
