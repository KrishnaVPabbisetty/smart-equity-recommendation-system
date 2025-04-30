# schemas/agent_chat.py
from pydantic import BaseModel

class AgentChatRequest(BaseModel):
    message: str

class AgentChatResponse(BaseModel):
    status: str
    response: str
