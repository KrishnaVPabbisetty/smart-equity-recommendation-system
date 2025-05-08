## ✅ Strategy Log Entry: MyStrategy – SMA-Only Crossover

### 1. Strategy Name
**MyStrategy – SMA-Only Crossover**

### 2. Strategy Description
A purely technical strategy that makes daily trades on **AAPL** based on the comparison of price vs. its 14-day **Simple Moving Average (SMA)**:

- **Buy** when current price crosses above SMA and the last trade wasn't a buy.
- **Sell** when price crosses below SMA and the last trade wasn't a sell.
- Uses `cash_at_risk = 0.25` for sizing positions.
- Ignores all LLM sentiment input (commented out in this version).

### 3. Backtesting Configuration
- **Backtest Dates**: Apr 1, 2025 – May 1, 2025
- **Symbol**: AAPL
- **Benchmark**: SPY
- **Cash at Risk**: 25%
- **Market Mode**: 24/7 with 1-day interval
- **Indicator Source**: `calculate_indicators()` utility (for SMA + RSI)

### 4. Key Performance Metrics

| Metric                    | Value           |
|---------------------------|-----------------|
| Total Return              | 0%              |
| Annual Return (CAGR)      | -0.41%          |
| Sharpe Ratio              | 0.07            |
| Sortino Ratio             | 0.08            |
| Max Drawdown              | -4.12%          |
| Volatility (Annualized)   | 18.1%           |
| Time in Market            | 70%             |
| Win Days %                | 61.9%           |
| Best Day                  | +1.99%          |
| Worst Day                 | -3.23%          |
| Correlation to SPY        | 42.45%          |
| Alpha                     | 0.01            |
| Beta                      | 0.15            |
| Recovery Factor           | 0.02            |

### 5. Insights & Learnings
- ⚙️ The strategy **did not lose value**, but also **generated no meaningful returns**.
- 🧠 Despite no profitability, **Sharpe and Sortino are slightly positive**, suggesting **balanced risk**.
- 📊 **Drawdowns remained shallow**, indicating the SMA helped reduce bad trades.
- ⏳ **Most trades were neutral**, suggesting that SMA(14) may not be a strong enough trigger alone.
- 🧪 This is a **good baseline for SMA logic**, but should be combined with momentum or volume filters for effectiveness.

### 6. Planned Changes / Next Steps
- Add **RSI confirmation** or volume-based triggers before placing trades.
- Increase **SMA window** to reduce signal noise (try SMA-20 or SMA-50).
- Consider adding **cool-down periods** between trades to avoid over-trading.
- Merge back **LLM sentiment layer** as a secondary filter before executing SMA signals.
- Explore **MACD or EMA crossovers** as alternatives to SMA(14).
