trategy Log Entry: MyStrategy
1. Strategy Name
MyStrategy

2. Strategy Description
A very basic long-only strategy that:

Buys AAPL with 100% of available capital on the first iteration.

Holds the position for the entire duration of the backtest (no rebalancing or selling).

Sleeps for 1 day between trading iterations (self.sleeptime = "1D").

No use of indicators, risk management, or exit logic.

3. Backtesting Configuration
Backtest Dates: Jan 1, 2025 – May 1, 2025

Data Source: Polygon via PolygonDataBacktesting

Symbol: AAPL

Benchmark: SPY

4. Key Performance Metrics
Metric	Value
Total Return	-16%
Annual Return (CAGR)	-41.77%
Sharpe Ratio	-0.97
Sortino Ratio	-1.35
Max Drawdown	-30.67%
Time in Market	84%
Volatility (ann.)	45.08%
Win Rate (Days)	48.48%
Correlation to SPY	-8.06%
Best Day	+9.95%
Worst Day	-7.9%
Recovery Factor	0.46

5. Insights & Learnings
This is essentially a "buy and hold AAPL" simulation without any timing logic.

The poor return and large drawdowns suggest that buying at the start of January 2025 led to exposure during a downtrend in AAPL.

No exit or stop-loss led to long periods of drawdown without mitigation.

High volatility and negative Sharpe imply poor risk-adjusted performance.

The strategy lacks adaptivity — it doesn't react to changing market conditions.

Negative correlation to SPY and lack of diversification further hurt its robustness.

6. Planned Changes / Next Steps
Add basic technical indicators (e.g., RSI < 30 for entry, SMA crossover for trend).

Introduce exit logic (e.g., stop-loss at -5%, take-profit at +10%).

Use a position sizing rule instead of committing 100% capital.

Test on multiple assets and compare results.

Consider adding a trailing stop to reduce downside risk.

