# services/agents/tools.py
from langchain_core.tools import tool
from utils.pinecone_retreival import retrieve_context
# LangChain-compatible tool functions using decorators
from routes.trading_routes import buy_stock, sell_stock
from routes.trading_routes import BuyStockRequest, SellStockRequest
from db import get_db
from routes.user_routes import get_current_user
from models.user import User
from db import SessionLocal

def get_db_session():
    return SessionLocal()
@tool
def retrieve_similar_docs(query: str) -> str:
    """Search financial documents relevant to the given query."""
    try:
        context = retrieve_context(query)

        if not context:
            return f"No relevant information found in the uploaded documents for the query: '{query}'."

        return f"Retrieved documents for the query '{query}':\n{context}"

    except Exception as e:
        # Log the error (replace with actual logging if available)
        print(f"Error in retrieve_similar_docs: {e}")
        return f"An error occurred while retrieving documents for the query: '{query}'."

@tool
def get_user_indicators(user_id: int) -> int:
    """Fetch RSI, SMA, MACD indicators for the user's portfolio."""
    return "[Simulated] Technical indicators for user: " + user_id

@tool
def fetch_stock_price(symbol: str) -> str:
    """Get the current stock price of a symbol."""
    return f"[Simulated] Price for {symbol}: $123.45"

@tool
def execute_trade_action(
    user_id: int,
    action: str,
    symbol: str,
    qty: float = 1,
    type: str = "market"
) -> str:
    """
    Execute a validated buy or sell action for a given user and stock symbol.
    Required: user_id, action, symbol.
    Optional: qty (default = 1), type (default = 'market').
    """   
    try:
        db = get_db_session()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return f"User {user_id} not found"

        action = action.lower()

        if action == "buy":
            order = BuyStockRequest(
                symbol=symbol,
                qty=qty,
                type=type,
                side="buy",
                time_in_force="gtc"
            )
            result = buy_stock(order, db=db, current_user=user)

        elif action == "sell":
            order = SellStockRequest(
                symbol=symbol,
                qty=qty,
                type=type,
                side="sell",
                time_in_force="gtc"
            )
            result = sell_stock(order, db=db, current_user=user)

        else:
            return f"No valid action: {action}"

        return f"Executed {action.upper()} for {symbol}. Order: {result}"

    except Exception as e:
        import traceback
        return f"Trade failed for {symbol}: {str(e)}"

TOOLS = [
    retrieve_similar_docs,
    get_user_indicators,
    fetch_stock_price,
    execute_trade_action,
]
