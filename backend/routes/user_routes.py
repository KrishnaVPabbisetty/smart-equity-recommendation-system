# routes/user_routes.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from config import SECRET_KEY, ALGORITHM
from db import get_db
from auth import get_user
from models.user import User
from jose import jwt, JWTError
from pydantic import BaseModel
from vectorstore.pinecone_handler import embedder, index
from langchain_openai import ChatOpenAI

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class ChatRequest(BaseModel):
    question: str


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user(db, username)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/chat")
def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    query_embedding = embedder.embed_query(request.question)
    search_results = index.query(vector=query_embedding, top_k=5, include_metadata=True)

    context_chunks = [
        match["metadata"]["chunk_text"]
        for match in search_results["matches"]
        if "chunk_text" in match["metadata"]
    ]
    context = "\n".join(context_chunks)

    prompt = f"""
    You are a helpful assistant. Use the context below to answer the question.

    Context:
    {context}

    Question: {request.question}
    Answer:
    """

    llm = ChatOpenAI(model_name="gpt-3.5-turbo")
    response = llm.invoke(prompt)

    return {"answer": response.content}
