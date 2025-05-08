# services/agents/agent_runner.py

import os
from typing import Optional, List, Dict

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage, AIMessage
from services.agents.prompts import SYSTEM_PROMPT
from services.agents.tools import TOOLS

# Create a mapping from tool name to function
TOOL_MAP = {tool.name: tool for tool in TOOLS}

# Initialize the OpenAI Chat Model
llm = ChatOpenAI(
    model_name="gpt-4-0613",
    temperature=0.0,
    openai_api_key=os.getenv("OPENAI_API_KEY")
).bind_tools(TOOLS)

def convert_history_to_langchain(history: List[Dict[str, str]]) -> List:
    message_map = {
        "user": HumanMessage,
        "assistant": AIMessage,
        "system": SystemMessage
    }
    return [message_map[msg["role"]](content=msg["content"]) for msg in history]

async def run_agent(
    history: List[Dict[str, str]],
    question: str,
    user_id: Optional[str] = None
) -> str:
    system = SystemMessage(content=SYSTEM_PROMPT)
    messages = [system] + convert_history_to_langchain(history) + [HumanMessage(content=question)]

    # First step: ask the LLM what it wants to do
    response = await llm.ainvoke(messages)

    tool_calls = response.additional_kwargs.get("tool_calls", [])
    if not tool_calls:
        return response.content

    tool_messages = []
    for call in tool_calls:
        tool_name = call["function"]["name"]
        args = call["function"]["arguments"]

        tool_fn = TOOL_MAP.get(tool_name)
        if not tool_fn:
            continue

        try:
            parsed_args = eval(args) if isinstance(args, str) else args
            parsed_args["user_id"] = user_id
            result = tool_fn.run(parsed_args)
        except Exception as e:
            result = f"Tool '{tool_name}' failed: {str(e)}"

        tool_messages.append(ToolMessage(tool_call_id=call["id"], content=result))

    # Final response after tool use
    final_response = await llm.ainvoke(messages + [response] + tool_messages)
    return final_response.content
