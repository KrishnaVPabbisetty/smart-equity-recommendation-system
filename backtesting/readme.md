## ✅ Strategy Log Entry: MyStrategy

### 1. Strategy Name

**MyStrategy**

### 2. Strategy Description

A very basic long-only strategy that:

* Buys **AAPL** with **100% of available capital** on the **first iteration**.
* Holds the position for the **entire duration** of the backtest (no rebalancing or selling).
* Sleeps for **1 day** between trading iterations.
* No use of indicators, risk management, or exit logic.

### 3. Backtesting Configuration

* **Backtest Dates**: Jan 1, 2025 – May 1, 2025
* **Data Source**: Polygon via `PolygonDataBacktesting`
* **Symbol**: AAPL
* **Benchmark**: SPY

### 4. Key Performance Metrics

| Metric               | Value   |
| -------------------- | ------- |
| Total Return         | -16%    |
| Annual Return (CAGR) | -41.77% |
| Sharpe Ratio         | -0.97   |
| Sortino Ratio        | -1.35   |
| Max Drawdown         | -30.67% |
| Time in Market       | 84%     |
| Volatility (ann.)    | 45.08%  |
| Win Rate (Days)      | 48.48%  |
| Correlation to SPY   | -8.06%  |
| Recovery Factor      | 0.46    |

### 5. Insights & Learnings

* **Buy and hold AAPL** during a poor period led to significant losses.
* No **exit logic** or **risk management** = long drawdowns.
* High exposure and no diversification hurt returns.
* Serves as a baseline for testing improvement.

### 6. Planned Changes / Next Steps

* Introduce indicators (e.g., SMA, RSI).
* Add stop-loss/take-profit.
* Compare across assets.

---

## ✅ Strategy Log Entry: MyStrategy – Random Trading

### 1. Strategy Name

**MyStrategy – Random Trading**

### 2. Strategy Description

Trades AAPL daily using random choices:

* Chooses randomly between Buy, Sell, Hold.
* Limits each trade to 25% of available capital.
* Avoids repeating same action consecutively.

### 3. Backtesting Configuration

* **Backtest Dates**: Jan 1, 2025 – May 1, 2025
* **Benchmark**: SPY
* **Cash at Risk**: 25%

### 4. Key Performance Metrics

| Metric                  | Value   |
| ----------------------- | ------- |
| Total Return            | -11%    |
| Annual Return (CAGR)    | -28.87% |
| Sharpe Ratio            | -2.51   |
| Sortino Ratio           | -3.06   |
| Max Drawdown            | -11.52% |
| Volatility (Annualized) | 13.1%   |
| Win Rate (Days)         | 36.96%  |
| Recovery Factor         | 0.94    |

### 5. Insights & Learnings

* Random behavior = erratic trades.
* Controlled drawdown due to capital limits.
* Poor risk-adjusted returns.
* Useful as a control baseline.

### 6. Planned Changes / Next Steps

* Replace with deterministic logic.
* Introduce technical indicators.
* Test probabilistic logic or RL agents.

---

## ✅ Strategy Log Entry: MyStrategy – LLM News Sentiment Trading

### 1. Strategy Name

**MyStrategy – LLM News Sentiment Trading**

### 2. Strategy Description

Combines LLM-based sentiment analysis of financial news:

* Fetches yesterday’s news, classifies sentiment via LLM.
* Buys if positive & confidence > 0.7.
* Sells if negative & confidence < 0.7.
* Uses 25% capital per trade.

### 3. Backtesting Configuration

* **Backtest Dates**: Apr 1, 2025 – May 1, 2025
* **Benchmark**: SPY

### 4. Key Performance Metrics

| Metric               | Value  |
| -------------------- | ------ |
| Total Return         | 1%     |
| Annual Return (CAGR) | 17.65% |
| Sharpe Ratio         | 0.75   |
| Sortino Ratio        | 0.96   |
| Max Drawdown         | -6.89% |
| Win Rate (Days)      | 72.22% |
| Correlation to SPY   | 43.33% |

### 5. Insights & Learnings

* Positive return; first profitable logic.
* High win rate; LLM added predictive value.
* Room to enhance via filtering.

### 6. Planned Changes / Next Steps

* Refine prompts.
* Combine with technical indicators.
* Backtest on more assets.

---

## ✅ Strategy Log Entry: MyStrategy – SMA-Only Crossover

### 1. Strategy Name

**MyStrategy – SMA-Only Crossover**

### 2. Strategy Description

Trades AAPL based on price vs. 14-day SMA:

* Buy if price > SMA
* Sell if price < SMA
* 25% capital per trade

### 3. Backtesting Configuration

* **Backtest Dates**: Apr 1, 2025 – May 1, 2025
* **Benchmark**: SPY

### 4. Key Performance Metrics

| Metric               | Value  |
| -------------------- | ------ |
| Total Return         | 0%     |
| Annual Return (CAGR) | -0.41% |
| Sharpe Ratio         | 0.07   |
| Sortino Ratio        | 0.08   |
| Max Drawdown         | -4.12% |
| Win Rate (Days)      | 61.9%  |

### 5. Insights & Learnings

* Stable but unprofitable.
* Shallow drawdowns = good sign.
* Need stronger triggers or filters.

### 6. Planned Changes / Next Steps

* Add RSI or MACD.
* Test on multiple stocks.
* Use longer SMA window.

---

## ✅ Strategy Log Entry: MyStrategy – Dual SMA Crossover (5-day vs. 20-day)

### 1. Strategy Name

**MyStrategy – Dual SMA Crossover**

### 2. Strategy Description

Trend-following approach:

* Buy when SMA(5) > SMA(20)
* Sell when SMA(5) < SMA(20)
* 25% capital per trade

### 3. Backtesting Configuration

* **Backtest Dates (short)**: Apr 1, 2025 – May 1, 2025
* **Benchmark**: SPY

### 4. Key Performance Metrics

| Metric               | Value   |
| -------------------- | ------- |
| Total Return         | -2%     |
| Annual Return (CAGR) | -19.42% |
| Sharpe Ratio         | -1.10   |
| Sortino Ratio        | -1.71   |
| Max Drawdown         | -5.9%   |
| Win Days %           | 42.86%  |

### 5. Insights & Learnings

* Weak short-term returns.
* SMA(5) may be too sensitive.
* Negative correlation to SPY = weak timing.

### 6. Planned Changes / Next Steps

* Try EMA or MACD.
* Add momentum confirmation.
* Backtest over longer periods.

---

## ✅ Strategy Log Entry: MyStrategy – SPY Trend Strategy with RSI + SMA Filters

### 1. Strategy Name

**MyStrategy – SPY Trend Strategy with RSI + SMA Filters**

### 2. Strategy Description

A strategy run on **SPY** with **AAPL** as benchmark, enhanced with:

* Buy when: `SMA(5) > SMA(20)` and `RSI < 70`
* Sell when: `SMA(5) < SMA(20)` and `RSI > 70`
* Capital exposure: 25% per trade
* Two versions tested:

  * Conservative (only buy if not already holding)
  * Aggressive (buy/sell regardless of last trade)

### 3. Backtesting Configuration

* **Backtest Dates**: Jan 1, 2024 – Jun 1, 2024
* **Symbol**: SPY
* **Benchmark**: AAPL

### 4. Key Performance Metrics

| Metric               | Value            |
| -------------------- | ---------------- |
| Total Return         | 3%               |
| Annual Return (CAGR) | \~6.7%           |
| Sharpe Ratio         | \~2.3            |
| Sortino Ratio        | \~3.5            |
| Max Drawdown         | -1.36% to -1.45% |
| Win Rate (Days)      | 53% to 55%       |
| Win Month %          | 83%              |
| Win Quarter %        | 100%             |

### 5. Insights & Learnings

* First consistently **positive-return strategy** with strong risk-adjusted metrics.
* **Low drawdowns**, high Sharpe, Sortino, and winning frequency.
* **Stable asset (SPY)** + technical filters = reliable setup.

### 6. Planned Changes / Next Steps

* Test with **higher cash\_at\_risk** or **compounded returns**.
* Layer in **news sentiment** as additional condition.
* Run on other stable ETFs (e.g., QQQ, DIA).
* Compare aggressive vs conservative behavior over longer spans.
