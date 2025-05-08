from datetime import datetime
from lumibot.backtesting import PolygonDataBacktesting
from lumibot.strategies import Strategy
from lumibot.entities import Asset
from dotenv import load_dotenv
from colorama import Fore, init
import os

from timedelta import Timedelta
from langchain_ollama import OllamaLLM
import json
from llmprompts import get_web_deets, prompt_template
from utils import calculate_indicators


init()
load_dotenv()

## Setup LLM
llm = OllamaLLM(model="openhermes", format="json")


class MyStrategy(Strategy):

    def initialize(self, cash_at_risk: float = 0.2, stock: str="AAPL"):
        self.sleeptime = "1D"  # Sleep for 1 day between iterations
        self.set_market("24/7")
        self.last_trade = None
        self.cash_at_risk = cash_at_risk
        self.symbol = stock

    def position_sizing(self):
        cash = self.get_portfolio_value()
        last_price = self.get_last_price(
            self.symbol
        )

        if last_price == None:
            quantity = 0
        else:
            quantity = cash * self.cash_at_risk/last_price
        
        return cash, last_price, quantity


    # Added date retrieval
    def get_dates(self):
        today = self.get_datetime()
        day_prior = today - Timedelta(days=1)
        return today.strftime("%Y-%m-%d"), day_prior.strftime("%Y-%m-%d")
    
    # Added sentiment
    def get_sentiment(self):
        today, day_prior = self.get_dates()
        news = get_web_deets(day_prior, today)
        print(news)
        result = llm.invoke(prompt_template(news))
        print(result)
        return json.loads(result)



    def on_trading_iteration(self):
        cash, last_price, quantity = self.position_sizing()
        historical_price = self.get_historical_prices(self.symbol, 30, "day")  # More days = better for indicators

        if historical_price is None:
            return

        indicators = calculate_indicators(historical_price)
        if not indicators["rsi"]:
            print("Indicators not ready — skipping this iteration.")
            return
        # Optionally use this for sentiment/LLM or raw logic
        print("RSI:", indicators['rsi'])
        print("SMA:", indicators['sma'])
        print("SMALL SMA:", indicators['sma_small']) # 5 Days
        print("LONG SMA:", indicators['sma_long']) # 20 Days

        if last_price!=None:
            if cash > (quantity * last_price):
                if indicators['sma_small'] > indicators['sma_long'] and indicators['rsi'] < 70 and self.last_trade!="buy":
                    self.sell_all()
                    order = self.create_order(
                        self.symbol,
                        quantity,
                        side="buy",
                        type="market"
                    )
                    print(Fore.LIGHTMAGENTA_EX + str(order) + Fore.RESET)
                    self.submit_order(order)
                    self.last_trade = "buy"

                elif indicators['sma_small'] < indicators['sma_long'] and indicators['rsi'] > 70 and self.last_trade!="sell":
                    print("Price crossed below SMA — SELL")
                    self.sell_all()
                    order = self.create_order(
                        self.symbol,
                        quantity,
                        side="sell",
                        type="market"
                    )
                    print(Fore.LIGHTMAGENTA_EX + str(order) + Fore.RESET)
                    self.submit_order(order)
                    self.last_trade = "sell"

        # news_data = self.get_sentiment()
        # sentiment = news_data["sentiment"]
        # probability = news_data["score"]

        # if last_price!=None:
        #     if cash > ( quantity * last_price ):
        #         if sentiment == "positive" and probability >= 0.7:
        #             if self.last_trade != "buy":
        #                 self.sell_all()
        #                 order = self.create_order(
        #                     self.symbol,
        #                     quantity,
        #                     side="buy",
        #                     type="market"
        #                 )
        #                 print(Fore.LIGHTMAGENTA_EX + str(order) + Fore.RESET)
        #                 self.submit_order(order)
        #                 self.last_trade = "buy"
        #         if sentiment == "negative" and probability < 0.7:
        #             if self.last_trade != "sell":
        #                 self.sell_all()
        #                 order = self.create_order(
        #                     self.symbol,
        #                     quantity,
        #                     side="sell",
        #                     type="market"
        #                 )
        #                 print(Fore.LIGHTMAGENTA_EX + str(order) + Fore.RESET)
        #                 self.submit_order(order)
        #                 self.last_trade = "sell"
            


if __name__ == "__main__":
    polygon_api_key = os.getenv("POLYGON_API_KEY")
    backtesting_start = datetime(2024, 1, 1)
    backtesting_end = datetime(2024, 6, 1)
    PolygonDataBacktesting.MIN_TIMESTEP = "day"
    result = MyStrategy.run_backtest(
        PolygonDataBacktesting,
        backtesting_start,
        backtesting_end,
        benchmark_asset="AAPL",
        parameters = {
            "stock": "SPY",
            "cash_at_risk": 0.25  
        },
        polygon_api_key=polygon_api_key  # Pass the Polygon.io API key here
    )