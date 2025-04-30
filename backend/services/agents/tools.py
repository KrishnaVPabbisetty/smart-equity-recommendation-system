# services/agents/tools.py

from langchain_core.tools import tool

# LangChain-compatible tool functions using decorators

@tool
def retrieve_similar_docs(query: str) -> str:
    """Search financial documents relevant to the given query."""
    return "[Simulated] Retrieved documents for: " + query

@tool
def get_user_indicators(user_id: str) -> str:
    """Fetch RSI, SMA, MACD indicators for the user's portfolio."""
    return "[Simulated] Technical indicators for user: " + user_id

@tool
def fetch_stock_price(symbol: str) -> str:
    """Get the current stock price of a symbol."""
    return f"[Simulated] Price for {symbol}: $123.45"

@tool
def execute_trade_action(user_id: str, action: str, symbol: str) -> str:
    """Execute a validated trade action for a given user and stock symbol."""
    return f"[Simulated] Executed {action} trade for {symbol} by user {user_id}"

TOOLS = [
    retrieve_similar_docs,
    get_user_indicators,
    fetch_stock_price,
    execute_trade_action,
]
