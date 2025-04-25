# main.py
from fastapi import FastAPI
from routes import auth_routes, user_routes, admin_routes
from init_db import init

app = FastAPI()
init() #initiates db

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(admin_routes.router)
