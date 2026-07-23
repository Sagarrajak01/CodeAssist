import os
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from dotenv import load_dotenv
from services.indexer import index_repository, delete_vector_collection
from services.chat import generate_chat_response

load_dotenv()

app = FastAPI(title="CodeAssist AI Microservice")

# Data Models for API Requests
class IndexRequest(BaseModel):
    repo_id: str
    extracted_path: str

class ChatRequest(BaseModel):
    repo_id: str
    query: str

@app.get("/health")
async def health_check():
    return {"status": "Python AI Microservice is running!"}

@app.post("/api/ai/index")
async def api_index_repo(req: IndexRequest, background_tasks: BackgroundTasks):
    """
    Endpoint called by the Node.js backend when a new repository is uploaded or cloned.
    We run the indexing as a background task so we can immediately return a 200 OK to Node.js.
    """
    if not os.path.exists(req.extracted_path):
        raise HTTPException(status_code=400, detail="Extracted path does not exist on disk.")
    
    # Run the heavy embedding and ChromaDB storage in the background
    background_tasks.add_task(index_repository, req.repo_id, req.extracted_path)
    
    return {
        "success": True, 
        "message": f"Started background indexing for repo: {req.repo_id}"
    }

@app.post("/api/ai/chat")
async def api_chat(req: ChatRequest):
    """
    Endpoint called by the Node.js backend when a user sends a chat message.
    """
    try:
        answer = generate_chat_response(req.repo_id, req.query)
        return {"success": True, "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to delete vector collection when repo is deleted
@app.delete("/api/ai/repos/{repo_id}")
async def api_delete_repo(repo_id: str):
    try:
        delete_vector_collection(repo_id)
        return {"success": True, "message": f"Deleted collection for repo: {repo_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"Starting Python AI Microservice on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
