# routes/agent_chat.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from routes.user_routes import get_current_user
from models.user import User
from services.agents.agent_runner import run_agent
from schemas.agent_chat import AgentChatRequest, AgentChatResponse

router = APIRouter(prefix="/api/agent-chat", tags=["Agent Chat"])

@router.post("/message", response_model=AgentChatResponse)
async def chat_with_agent(
    payload: AgentChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        response = await run_agent(payload.message, current_user.id)
        return AgentChatResponse(status="success", response=response)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
