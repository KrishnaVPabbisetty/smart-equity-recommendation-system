# utils/indicators.py

import numpy as np

def calculate_sma(prices: list, period: int = 14) -> float:
    if len(prices) < period:
        return round(np.mean(prices), 2)
    return round(np.mean(prices[-period:]), 2)

def calculate_rsi(prices: list, period: int = 14) -> float:
    if len(prices) < period + 1:
        return 0.0

    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)

    avg_gain = np.mean(gains[-period:])
    avg_loss = np.mean(losses[-period:])

    if avg_loss == 0:
        return 100.0  # Extremely strong positive momentum

    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)

def calculate_macd(prices: list, short_period: int = 12, long_period: int = 26, signal_period: int = 9) -> float:
    if len(prices) < long_period:
        return 0.0

    short_ema = np.convolve(prices, np.ones(short_period) / short_period, mode='valid')
    long_ema = np.convolve(prices, np.ones(long_period) / long_period, mode='valid')

    # Trim EMA arrays to the same length
    min_len = min(len(short_ema), len(long_ema))
    macd_line = short_ema[-min_len:] - long_ema[-min_len:]

    if len(macd_line) < signal_period:
        return 0.0

    signal_line = np.convolve(macd_line, np.ones(signal_period) / signal_period, mode='valid')
    histogram = macd_line[-len(signal_line):] - signal_line

    return round(histogram[-1], 2)
