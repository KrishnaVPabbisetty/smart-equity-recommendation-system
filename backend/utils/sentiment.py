# utils/sentiment.py

import os
import openai
import requests
from utils.pinecone_retreival import retrieve_context
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import json
from langchain_community.utilities import GoogleSerperAPIWrapper
from datetime import datetime, timedelta


openai.api_key = os.getenv("OPENAI_API_KEY")
SERPER_API_KEY = os.getenv("SERPER_API_KEY")
search = GoogleSerperAPIWrapper(k=10, type="news")

def prompt_template(text: str) -> str:
    return f"""You are a helpful financial assistant, provide helpful, harmless and honest answers. 
Using the news below, respond as to whether the sentiment in the news is either ['positive', 'negative'] and give a score of 
how strong the sentiment is between 0 to 1. Respond using the keys sentiment, score. 

example result 
'sentiment':'positive', 
'score':0.2

Do not reply with neutral sentiment or mixed. 

News
{text}"""
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)

def analyze_sentiment_text(text: str) -> dict:
    try:
        prompt = prompt_template(text)

        # Run the LLM with the prompt
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        print(f"GPT Output:\n{content}")

        sentiment_line = next(line for line in content.splitlines() if "sentiment" in line)
        score_line = next(line for line in content.splitlines() if "score" in line)

        sentiment = sentiment_line.split(":")[1].strip().strip("',\"")
        score = float(score_line.split(":")[1].strip().strip("',\""))

        return {"sentiment": sentiment, "score": score}

    except Exception as e:
        print(f"Sentiment error: {e}")
        return {"sentiment": "positive", "score": 0.5, "error": str(e)}

def fetch_recent_news(symbol: str, days: int = 3) -> str:
    """
    Use LangChain GoogleSerperAPIWrapper to fetch structured news snippets for a symbol.
    """
    try:
        end = datetime.utcnow().date()
        start = end - timedelta(days=days)

        query = f"{symbol} stock price before:{end.isoformat()} after:{start.isoformat()}"
        results = search.results(query)

        articles = results.get("news", [])[:5]
        if not articles:
            return ""

        combined_news = "\n".join(f"{item['title']}: {item['snippet']}" for item in articles)
        return combined_news

    except Exception as e:
        return f"Error fetching news: {e}"

def analyze_sentiment_from_documents_or_news(symbol: str) -> dict:
    print(f"Analyzing sentiment for: {symbol}")
    query = f"Latest financial and news insights for {symbol.upper()} stock"
    context = retrieve_context(query)

    print("Here is the context: ", context[:10])

    # Require at least 2 occurrences of the symbol or company name
    match_score = context.lower().count(symbol.lower())
    if match_score >= 2:
        print("Using Pinecone context for sentiment.")
        return analyze_sentiment_text(context)
    else:
        print("Context not relevant enough, falling back to Serper news.")

    news_text = fetch_recent_news(symbol)
    print(f"News text:\n{news_text[:5]}")

    if news_text.startswith("Error"):
        return {"sentiment": "positive", "score": 0.5, "error": news_text}

    return analyze_sentiment_text(news_text)
