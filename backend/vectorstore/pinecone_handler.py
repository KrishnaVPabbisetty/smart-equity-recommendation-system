# vectorstore/pinecone_handler.py
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from uuid import uuid4
from typing import List
from langchain_community.embeddings import OpenAIEmbeddings

# Load environment variables
load_dotenv()

# Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

INDEX_NAME = "project-docs"

# Create index manually (assume dimension 1536 for OpenAI)
if not pc.has_index(INDEX_NAME):
    pc.create_index(
        name=INDEX_NAME,
        dimension=1536,
        metric="cosine",
        spec={"serverless": {"cloud": "aws", "region": "us-east-1"}}
    )

index = pc.Index(INDEX_NAME)
embedder = OpenAIEmbeddings()

def upsert_chunks(chunks: List[str], metadata: dict) -> int:
    vectors = []
    for chunk in chunks:
        embedding = embedder.embed_query(chunk)
        vectors.append({
            "id": str(uuid4()),
            "values": embedding,
            "metadata": {
                **metadata,
                "chunk_text": chunk
            }
        })

    index.upsert(vectors=vectors)
    return len(vectors)
