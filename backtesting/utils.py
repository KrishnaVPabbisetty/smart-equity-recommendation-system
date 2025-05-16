import pandas_ta as ta
import pandas as pd

def calculate_indicators(bars):
    if bars is None or not hasattr(bars, 'df'):
        return {"rsi": None, "sma": None, "macd": None}

    df = bars.df.copy()

    if df.empty or 'close' not in df.columns:
        return {"rsi": None, "sma": None, "macd": None}

    df = df.sort_index()

    #changes
    window_length = 14
    sma_short_window_length = 5
    sma_long_window_length = 20
    # changes end
    try:
        # close = df['close']
        # if close.isnull().any() or len(close) < 15:
        #     raise ValueError("Close price data has NaNs or is too short.")

        # # Calculate indicators
        # rsi_series = ta.rsi(close, length=14)
        # sma_series = ta.sma(close, length=14)
        # macd_df = ta.macd(close)

        # if rsi_series is None or sma_series is None or macd_df is None:
        #     raise ValueError("Indicator calculation returned None.")

        # df['rsi'] = rsi_series
        # df['sma'] = sma_series
        # df = df.join(macd_df)

        # return {
        #     "rsi": df['rsi'].dropna().iloc[-1] if 'rsi' in df else None,
        #     "sma": df['sma'].dropna().iloc[-1] if 'sma' in df else None,
        #     "macd": df['MACD_12_26_9'].dropna().iloc[-1] if 'MACD_12_26_9' in df else None
        # }


        #changes

        # print(df.head())
        # print(df.info())
    

        df['diff'] = df['close'].diff(1)
        df['sma'] = df['close'].rolling(window=window_length).mean()
        df['sma_small'] = df['close'].rolling(window=sma_short_window_length).mean()
        df['sma_long'] = df['close'].rolling(window=sma_long_window_length).mean()
        df['gain'] = df['diff'].clip(lower=0).round(2)
        df['loss'] = df['diff'].clip(upper=0).abs().round(2)

    
        # Get initial Averages
        df['avg_gain'] = df['gain'].rolling(window=window_length, min_periods=window_length).mean()[:window_length+1]
        df['avg_loss'] = df['loss'].rolling(window=window_length, min_periods=window_length).mean()[:window_length+1]

        # print(df)

        # View first SMA value
        # print(df.iloc[window_length-1: window_length+2])


        # Average Gains
        for i, row in enumerate(df['avg_gain'].iloc[window_length+1:]):
                idx = df.index[i + window_length + 1]
                prev_idx = df.index[i + window_length]
                
                df.loc[idx, 'avg_gain'] =\
                (df.loc[prev_idx, 'avg_gain']* (window_length - 1) + df.loc[idx, 'gain'])\
                /window_length

        # Average Losses
        for i, row in enumerate(df['avg_loss'].iloc[window_length+1:]):
                idx = df.index[i + window_length + 1]
                prev_idx = df.index[i + window_length]
                
                df.loc[idx, 'avg_loss'] =\
                (df.loc[prev_idx, 'avg_loss']* (window_length - 1) + df.loc[idx, 'gain'])\
                /window_length
        # View initial results
        
        # Calculating rs
        df['rs'] = df['avg_gain'] / df['avg_loss']
        

        # Calculating rsi
        df['rsi'] = 100 - (100 / (1.0 + df['rs']))


        # print(df)
    
        return {
            "rsi": df['rsi'].dropna().iloc[-1] if 'rsi' in df else None,
            "sma": df['sma'].dropna().iloc[-1] if 'sma' in df else None,
            "sma_small": df['sma_small'].dropna().iloc[-1] if 'sma' in df else None,
            "sma_long": df['sma_long'].dropna().iloc[-1] if 'sma' in df else None
        }
    
        #changes -complete
    except Exception as e:
        print(f"[Indicator Calculation Error] {e}")
        return {"rsi": None, "sma": None, "macd": None}
