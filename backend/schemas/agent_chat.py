# schemas/agent_chat.py
from pydantic import BaseModel
from typing import List, Dict

class AgentChatRequest(BaseModel):
    history: List[Dict[str, str]]
    question: str

class AgentChatResponse(BaseModel):
    status: str
    response: str