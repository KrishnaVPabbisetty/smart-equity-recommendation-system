from datetime import datetime
from lumibot.backtesting import PolygonDataBacktesting
from lumibot.strategies import Strategy
from colorama import fore
import random

class MyStrategy(Strategy):
    parameters = {
        "symbol": "AAPL",
    }

    def initialize(self):
        self.sleeptime = "1D"  # Sleep for 1 day between iterations

    def on_trading_iteration(self):
        if self.first_iteration:
            symbol = self.parameters["symbol"]
            price = self.get_last_price(symbol)
            qty = self.portfolio_value / price
            order = self.create_order(symbol, quantity=qty, side="buy")
            self.submit_order(order)

if __name__ == "__main__":
    polygon_api_key = "Z5dC1hwhljcEqr39KtAkCaKaKczASZZ5"  # Replace with your actual Polygon.io API key
    backtesting_start = datetime(2025, 1, 1)
    backtesting_end = datetime(2025, 5, 1)
    result = MyStrategy.run_backtest(
        PolygonDataBacktesting,
        backtesting_start,
        backtesting_end,
        benchmark_asset="SPY",
        polygon_api_key=polygon_api_key  # Pass the Polygon.io API key here
    )