## ✅ Strategy Log Entry: MyStrategy – LLM News Sentiment Trading

### 1. Strategy Name
**MyStrategy – LLM News Sentiment Trading**

### 2. Strategy Description
A strategy that integrates LLM-based sentiment analysis on recent financial news to determine daily trading actions for **AAPL**:

- Retrieves news from the previous day using a `get_web_deets` function.
- Uses `OllamaLLM` with a custom `prompt_template` to classify sentiment and assign a confidence score.
- Executes trades based on sentiment:
  - **Buy** if sentiment is `"positive"` and confidence ≥ 0.7
  - **Sell** if sentiment is `"negative"` and confidence < 0.7
- Uses `cash_at_risk = 0.25` for position sizing.
- Avoids repeating the same trade action consecutively.

### 3. Backtesting Configuration
- **Backtest Dates**: Apr 1, 2025 – May 1, 2025
- **Symbol**: AAPL
- **Data Source**: PolygonDataBacktesting
- **Benchmark**: SPY
- **LLM Used**: `openhermes` via Ollama
- **Cash at Risk**: 25%

### 4. Key Performance Metrics

| Metric                    | Value           |
|---------------------------|-----------------|
| Total Return              | +1%             |
| Annual Return (CAGR)      | 17.65%          |
| Sharpe Ratio              | 0.75            |
| Sortino Ratio             | 0.96            |
| Max Drawdown              | -6.89%          |
| Volatility (Annualized)   | 24.74%          |
| Time in Market            | 70%             |
| Win Days %                | 72.22%          |
| Best Day                  | +2.78%          |
| Worst Day                 | -3.74%          |
| Correlation to SPY        | 43.33%          |
| Alpha                     | -0.13           |
| Beta                      | 0.22            |
| Recovery Factor           | 0.19            |

### 5. Insights & Learnings
- ✅ This is your **first strategy with a positive return**, outperforming the random and static strategies.
- 📈 The **72% win day rate** suggests LLM-based sentiment filtering added meaningful predictive power.
- 📉 **Sharpe and Sortino ratios are positive**, indicating better risk-adjusted returns.
- ⚖️ Drawdowns were relatively shallow and recoveries were smooth, showing good timing despite few trades.
- 🔍 Performance still lags SPY, indicating room to improve **timing or trade sizing**.

### 6. Planned Changes / Next Steps
- Enhance `prompt_template` to include **more granular confidence bands** or directional scoring.
- Explore **multi-day sentiment aggregation** for more stable signals.
- Add **technical indicators** (e.g., SMA, ATR) as filters before confirming LLM recommendations.
- Try **different LLMs or prompt formats** to compare sentiment reliability.
- Deploy on other symbols to test **cross-asset generalization**.
