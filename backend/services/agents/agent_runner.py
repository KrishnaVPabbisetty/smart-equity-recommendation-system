# services/agents/agent_runner.py

import os
from typing import Optional

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
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

async def run_agent(user_query: str, user_id: Optional[str] = None) -> str:
    system = SystemMessage(content=SYSTEM_PROMPT)
    user = HumanMessage(content=user_query)

    # First step: ask the LLM what it wants to do
    response = await llm.ainvoke([system, user])

    # Check if it requested a tool
    tool_calls = response.additional_kwargs.get("tool_calls", [])
    
    if not tool_calls:
        return response.content

    tool_messages = []
    for call in tool_calls:
        tool_name = call["function"]["name"]
        args = call["function"]["arguments"]

        # Find the tool
        tool_fn = TOOL_MAP.get(tool_name)
        if not tool_fn:
            continue

        try:
            parsed_args = eval(args) if isinstance(args, str) else args
            #if user_id:
            parsed_args["user_id"] = str(user_id)
            result = tool_fn.run(parsed_args)
        except Exception as e:
            result = f"Tool '{tool_name}' failed: {str(e)}"

        tool_messages.append(ToolMessage(tool_call_id=call["id"], content=result))

    # Final response after tool use
    final_response = await llm.ainvoke([system, user, response] + tool_messages)

    return final_response.content
