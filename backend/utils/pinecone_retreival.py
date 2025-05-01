from vectorstore.pinecone_handler import embedder, index

def retrieve_context(question: str) -> str:
    
    try:
        query_embedding = embedder.embed_query(question)
        search_results = index.query(vector=query_embedding, top_k=5, include_metadata=True)

        context_chunks = [
            match["metadata"]["chunk_text"]
            for match in search_results["matches"]
            if "chunk_text" in match["metadata"]
        ]
        context = ""
        if(len(context_chunks)):
            context = "\n".join(context_chunks)

        return context
    
    except KeyError as e:
        print(f"KeyError during retrieval: {e}")
        return ""

    except Exception as e:
        print(f"Unexpected error: {e}")
        return ""
