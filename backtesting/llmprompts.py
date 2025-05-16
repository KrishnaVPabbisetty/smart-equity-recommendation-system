from langchain_ollama import OllamaLLM
from langchain_community.utilities import GoogleSerperAPIWrapper
from dotenv import load_dotenv
import json


load_dotenv()

# result_key_for_type="news"
search = GoogleSerperAPIWrapper(k=15, type="news")
llm = OllamaLLM(model="llama3.2", format="json")


def get_web_deets(
    news_start_date: str, news_end_date: str, stock_name: str = None
) -> str:
    """Searches the web for news about stock as at a specific date."""
    if stock_name:
        return search.run(
            f"{stock_name} price before:{news_end_date} after:{news_start_date}"
        )
    else:
        return search.run(
            f"spy price before: {news_end_date} after:{news_start_date}"
        )


def get_detailed_web_deets(
    news_start_date: str, news_end_date: str, stock_name: str = None
) -> str:
    """Searches the web for news about stock as at a specific date."""
    if stock_name:
        return json.dumps(
            search.results(
                f"{stock_name} price before:{news_end_date} after:{news_start_date}"
            ),
            sort_keys=True,
            indent=4,
        )
    else:
        return json.dumps(
            search.results(
                f"spy price before:{news_end_date} after:{news_start_date}"
            ),
            sort_keys=True,
            indent=4,
        )


def prompt_template(web_deets: str) -> str:
    """Parses results from a web search into a formatted prompt"""
    return f"""You are a helpful financial assistant, provide helpful, harmless and honest answers. 
            Using the news below, respond as to whether the sentiment in the news is either ['positive', 'negative'] and give a score of 
            how strong the sentiment is between 0 to 1. Respond using the keys sentiment, score. 

            example result 
            'sentiment':'positive', 
            'score':0.2

            Do not reply with neutral sentiment or mixed. 
                
            News
            {web_deets}"""


def direct_recommendation(web_deets: str) -> str:
    """Parses results from a web search into a formatted prompt"""
    return f"""You are a helpful financial assistant, provide helpful, harmless and honest answers. 
            Using the news below, respond as to whether an investor should you would buy, sell or hold the stock and how strong the signal is between 0 to 1. 
            The output should be in the format of recommendation and score. 

            Example Result 
            'recommendation':'hold', 
            'score':0.2

            News
            {web_deets}"""


if __name__ == "__main__":
    result = get_detailed_web_deets("2023-08-04", "2023-08-05")
    print(result)
    # res = llm.invoke(prompt_template(result))
    # res = json.loads(res)
    # print(res.keys())