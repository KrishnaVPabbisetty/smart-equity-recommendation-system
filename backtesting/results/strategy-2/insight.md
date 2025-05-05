## ✅ Strategy Log Entry: MyStrategy – Random Trading

### 1. Strategy Name
**MyStrategy – Random Trading**

### 2. Strategy Description
A randomized trading strategy applied to **AAPL**:

- Every day, randomly chooses one of three actions: **Buy**, **Sell**, or **Hold**.
- Uses `cash_at_risk = 0.25` to limit exposure per trade.
- Executes full market orders when buying or selling.
- Avoids repeating the same trade direction consecutively.
- Operates on a "24/7" market setting with daily frequency.

### 3. Backtesting Configuration
- **Backtest Dates**: Jan 1, 2025 – May 1, 2025
- **Symbol**: AAPL
- **Data Source**: PolygonDataBacktesting
- **Benchmark**: SPY
- **Cash at Risk**: 25%

### 4. Key Performance Metrics

| Metric                    | Value         |
|---------------------------|---------------|
| Total Return              | -11%          |
| Annual Return (CAGR)      | -28.87%       |
| Sharpe Ratio              | -2.51         |
| Sortino Ratio             | -3.06         |
| Max Drawdown              | -11.52%       |
| Volatility (Annualized)   | 13.1%         |
| Time in Market            | 77%           |
| Win Rate (Days)           | 36.96%        |
| Win Month %               | 40.0%         |
| Best Day                  | +3.05%        |
| Worst Day                 | -2.76%        |
| Alpha                     | -0.32         |
| Correlation to SPY        | 22.15%        |
| Recovery Factor           | 0.94          |

### 5. Insights & Learnings
- 🔄 **Erratic trading pattern** due to randomness, evident in excessive buy/sell activity.
- 📉 Despite the randomness, **drawdowns were limited** due to capped capital usage per trade.
- ⚠️ **Very poor risk-adjusted returns** (Sharpe -2.51, Sortino -3.06).
- ❌ **Win rate was low (36.96%)**, as expected from a strategy without informational edge.
- 🧪 Serves as a good **control group** for comparing against signal-driven strategies.

### 6. Planned Changes / Next Steps
- Replace randomness with **deterministic or indicator-based logic** (e.g., RSI, SMA).
- Use the framework for **reinforcement learning** or probabilistic trade policy tests.
- Experiment with different `cash_at_risk` values to analyze capital sensitivity.
- Add a **cooldown mechanism** to reduce overtrading and slippage effects.
