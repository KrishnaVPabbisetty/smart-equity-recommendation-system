# utils/market_data.py

import os
import requests
from datetime import datetime, timedelta


ALPACA_BASE_URL = "https://data.alpaca.markets/v2"

def fetch_historical_bars(symbol: str, start_date: str, end_date: str, timeframe: str, headers: dict) -> list:
    url = f"{ALPACA_BASE_URL}/stocks/{symbol}/bars"
    params = {
        "start": f"{start_date}T00:00:00Z",
        "end": f"{end_date}T23:59:59Z",
        "timeframe": timeframe,
        "limit": 1000
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        raise Exception(f"Alpaca API Error: {response.status_code} - {response.text}")

    return response.json().get("bars", [])
