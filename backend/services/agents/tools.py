# services/agents/tools.py
from langchain_core.tools import tool
from utils.pinecone_retreival import retrieve_context
from utils.market_data import fetch_historical_bars
from utils.alpaca import get_alpaca_headers
from utils.indicators import  calculate_sma, calculate_rsi, calculate_macd
from utils.sentiment import analyze_sentiment_from_documents_or_news, get_accurate_sentiment
# LangChain-compatible tool functions using decorators
from routes.trading_routes import buy_stock, sell_stock
from routes.trading_routes import BuyStockRequest, SellStockRequest
from db import get_db, SessionLocal
from routes.user_routes import get_current_user
from models.user import User
from db import SessionLocal
from datetime import datetime, timedelta

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
    return f"[Simulated] Price for {symbol}: $198.53"

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

@tool
def test_fetch_bars(user_id: int, symbol: str, start_date: str, end_date: str, timeframe: str = "1Day") -> str:
    """
    Fetch historical bars from Alpaca for a given user and calculate SMA, RSI, and MACD.
    """
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return f"User {user_id} not found"

        headers = get_alpaca_headers(user)
        bars = fetch_historical_bars(symbol, start_date, end_date, timeframe, headers)
        if not bars:
            return f"No data returned for {symbol} between {start_date} and {end_date}."

        close_prices = [bar["c"] for bar in bars]

        sma = calculate_sma(close_prices)
        rsi = calculate_rsi(close_prices)
        macd = calculate_macd(close_prices)

        sample = bars[:3]
        resulting_bars = "\n".join(
            f"{bar['t']} | O: {bar['o']} H: {bar['h']} L: {bar['l']} C: {bar['c']} V: {bar['v']}" for bar in sample
        )

        return (
            f"Sample bars for {symbol}:\n{resulting_bars}\n\n"
            f"Technical Indicators:\n"
            f"SMA: {sma}\n"
            f"RSI: {rsi}\n"
            f"MACD: {macd}"
        )
    except Exception as e:
        return f"Error: {str(e)}"


@tool
def generate_stock_recommendation(user_id: int, symbol: str) -> str:
    """
    Generate a stock recommendation based on sentiment and technical indicators and the symbol sent by the user.
    """
    try:

        print("Calling stock recommendation for symbol "+ symbol )
        db = SessionLocal()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return f"User {user_id} not found."

        print("User found ")
        headers = get_alpaca_headers(user)

        # Fetch historical bars
        end_date = datetime.utcnow().date() - timedelta(days=1)
        start_date = end_date - timedelta(days=30)

        print(str(start_date.isoformat()) + str(end_date.isoformat()))
        bars = fetch_historical_bars(symbol, start_date, end_date, "1Day", headers)

        if not bars:
            return f"No bars returned for {symbol} between {start_date} and {end_date}."

        if not bars or len(bars) < 20:
            return f"Not enough market data available for {symbol}."

        closes = [bar["c"] for bar in bars]
        sma = calculate_sma(closes)
        rsi = calculate_rsi(closes)
        macd = calculate_macd(closes)
        
        print(f"indicators: rsi: {rsi}, sma: {sma}, macd:{macd}")

        # Analyze sentiment
        sentiment_result = analyze_sentiment_from_documents_or_news(symbol)
        sentiment = sentiment_result.get("sentiment", "positive")
        score = sentiment_result.get("score", 0.5)
        print(sentiment_result)
        # # Decide recommendation

        if rsi < 70 and macd > -1 and sentiment=="positive":
            action = "BUY"
        elif rsi > 70 and macd < 1 and sentiment=="negative":
            action = "SELL"


        recommendation_result =(
            f"Recommendation:\n{action} – {symbol.upper()} stock shows {action.lower()} signals based on the latest analysis.\n\n"
            f"Reasoning:\n\n"
            f"Sentiment Analysis: {sentiment.upper()} (score: {score})\n\n"
            f"Technical Indicators:\n"
            f"- SMA: {sma}\n"
            f"- RSI: {rsi}\n"
            f"- MACD: {macd}\n\n"
            f"Conclusion:\nBased on the indicators and sentiment, the suggested action is: {action}."
        )

        print(recommendation_result)
        # Format response
        return recommendation_result

    except Exception as e:
        return f"An error occurred: {str(e)}"
    
TOOLS = [
    retrieve_similar_docs,
    get_user_indicators,
    fetch_stock_price,
    execute_trade_action,
    generate_stock_recommendation,
    test_fetch_bars
]
