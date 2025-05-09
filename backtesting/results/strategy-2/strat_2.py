from datetime import datetime
from lumibot.backtesting import PolygonDataBacktesting
from lumibot.strategies import Strategy
from lumibot.entities import Asset
from dotenv import load_dotenv
from colorama import Fore, init
import random
import os


init()
load_dotenv()

class MyStrategy(Strategy):

    def initialize(self, cash_at_risk: float = 0.2, stock: str="AAPL"):
        self.sleeptime = "1D"  # Sleep for 1 day between iterations
        self.set_market("24/7")
        self.last_trade = None
        self.cash_at_risk = cash_at_risk
        self.symbol = stock

    def position_sizing(self):
        cash = self.get_cash()
        last_price = self.get_last_price(
            self.symbol
        )

        if last_price == None:
            quantity = 0
        else:
            quantity = cash * self.cash_at_risk/last_price
        
        return cash, last_price, quantity

    def on_trading_iteration(self):
        cash, last_price, quantity = self.position_sizing()

        if last_price!=None:
            if cash > ( quantity * last_price ):
                choice = random.choice([0, 1, 2])
                print("Here is a random choice: ", choice)
                if choice == 0: #Hold
                    pass
                elif choice == 1:  #Buy
                    if self.last_trade != "buy":
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
                elif choice == 2: #Sell
                    if self.last_trade != "sell":
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
            


if __name__ == "__main__":
    polygon_api_key = os.getenv("POLYGON_API_KEY")
    backtesting_start = datetime(2025, 1, 1)
    backtesting_end = datetime(2025, 5, 1)
    PolygonDataBacktesting.MIN_TIMESTEP = "day"
    result = MyStrategy.run_backtest(
        PolygonDataBacktesting,
        backtesting_start,
        backtesting_end,
        benchmark_asset="SPY",
        parameters = {
            "stock": "AAPL",
            "cash_at_risk": 0.25  
        },
        polygon_api_key=polygon_api_key  # Pass the Polygon.io API key here
    )