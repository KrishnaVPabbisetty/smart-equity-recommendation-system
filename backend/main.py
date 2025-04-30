# main.py
from fastapi import FastAPI
from routes import auth_routes, user_routes, admin_routes, trading_routes, healthcheck, agent_chat
from init_db import init


app = FastAPI()
init()  # initiates db

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(admin_routes.router)
app.include_router(trading_routes.router)
app.include_router(healthcheck.router)
app.include_router(agent_chat.router)