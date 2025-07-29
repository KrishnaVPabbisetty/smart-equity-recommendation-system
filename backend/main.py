# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (
    auth_routes,
    user_routes,
    admin_routes,
    trading_routes,
    healthcheck,
    agent_chat,
    market_routes,
)

from init_db import init


app = FastAPI()
init()  # initiates db

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can also use ["*"] temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(admin_routes.router)
app.include_router(trading_routes.router)
app.include_router(healthcheck.router)
app.include_router(agent_chat.router)
app.include_router(market_routes.router)

