from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models.user import User
from auth import get_user, get_token_from_ws
from config import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
import json
import asyncio
import websockets

router = APIRouter()

ALPACA_WS_URL = "wss://stream.data.alpaca.markets/v2/iex"


async def get_current_user_from_ws(websocket: WebSocket, db: Session) -> User:
    token = get_token_from_ws(websocket)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise WebSocketDisconnect(code=4001)
    except JWTError:
        raise WebSocketDisconnect(code=4001)

    user = get_user(db, username)
    print(user)
    if not user:
        raise WebSocketDisconnect(code=4001)
    return user


@router.websocket("/ws/market")
async def market_data_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()

    try:
        current_user = await get_current_user_from_ws(websocket, db)
        # Get symbols from user's Alpaca portfolio
        import requests

        response = requests.get(
            "https://paper-api.alpaca.markets/v2/positions",
            headers={
                "APCA-API-KEY-ID": current_user.alpaca_api_key,
                "APCA-API-SECRET-KEY": current_user.alpaca_secret_key,
            },
        )
        print(response)

        if response.status_code != 200:
            await websocket.send_text("Failed to retrieve portfolio from Alpaca")
            await websocket.close()
            return

        symbols = [position["symbol"] for position in response.json()]
        print(symbols)
        if not symbols:
            await websocket.send_text("No active positions to subscribe to")
            await websocket.close()
            return

        # Connect to Alpaca WebSocket
        async with websockets.connect(ALPACA_WS_URL) as alpaca_ws:
            # Authenticate
            print(current_user.username)
            auth_msg = {
                "action": "auth",
                "key": current_user.alpaca_api_key,
                "secret": current_user.alpaca_secret_key,
            }
            await alpaca_ws.send(json.dumps(auth_msg))
            auth_response = await alpaca_ws.recv()
            await websocket.send_text(f"Auth response: {auth_response}")
            print("Auth response:", auth_response)

            # Subscribe
            sub_msg = {"action": "subscribe", "trades": symbols}
            await alpaca_ws.send(json.dumps(sub_msg))
            sub_response = await alpaca_ws.recv()
            await websocket.send_text(f"Subscribe response: {sub_response}")
            print("Subscribe response:", sub_response)

            # Forward live trades
            while True:
                try:
                    data = await alpaca_ws.recv()
                    print("Trade update:", data)
                    await websocket.send_text(data)
                except websockets.exceptions.ConnectionClosed:
                    print("Alpaca WebSocket disconnected")
                    break

    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        await websocket.send_text(f"WebSocket error: {str(e)}")
        await websocket.close()
