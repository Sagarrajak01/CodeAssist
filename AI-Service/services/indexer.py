import os
import concurrent.futures
import requests
from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")

if os.getenv("HF_TOKEN"):
    os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")
    # Prevents authentication crashes
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv("HF_TOKEN")

# PERFORMANCE: Batch size set to 64 to optimize CPU/GPU memory.
# Higher batch sizes speed up embedding but risk Out-Of-Memory (OOM) errors on constrained systems.
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    encode_kwargs={'batch_size': 64} 
)

#  Prevents indexing heavy dependencies and compiled artifacts.

IGNORE_DIRS = {
    "node_modules", ".git", "venv", ".venv", "__pycache__", "dist", "build", ".next",
}
IGNORE_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".zip", 
    ".lock", ".bin", ".exe", ".dll", ".pyc", ".mp4", ".mp3",
    ".svg", ".eot", ".woff", ".ttf"
}

def read_single_file(file_path, extracted_path, repo_id):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            if not content.strip():
                return None
            
            # accurate file trees and clickable source links without leaking internal server filesystem paths.
            return Document(
                page_content=content,
                metadata={
                    "source": os.path.relpath(file_path, extracted_path),
                    "repo_id": repo_id,
                },
            )
    except Exception:
        return None

def index_repository(repo_id: str, extracted_path: str):
    print(f"[{repo_id}] Starting indexing...")
    file_paths = []

    # Fast traversal: Modifying `dirs` in-place prevents os.walk from even entering ignored directories
    for root, dirs, files in os.walk(extracted_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if os.path.splitext(file)[1].lower() not in IGNORE_EXTS:
                file_paths.append(os.path.join(root, file))

    docs = []
    
    # PERFORMANCE: I/O bound operation. ThreadPool is preferred over ProcessPool here
    # because the GIL is released during disk reads, effectively bypassing disk latency.
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(read_single_file, path, extracted_path, repo_id) for path in file_paths]
        for future in concurrent.futures.as_completed(futures):
            doc = future.result()
            if doc:
                docs.append(doc)

    print(f"[{repo_id}] Found {len(docs)} files.")

    # NLP CONSTRAINT: ~1000 chars roughly maps to a logical code block (function/class).
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunked_docs = text_splitter.split_documents(docs)
    print(f"[{repo_id}] Created {len(chunked_docs)} chunks.")

    try:
        vectorstore = Chroma(
            collection_name=f"repo_{repo_id}",
            embedding_function=embeddings,
            persist_directory=CHROMA_DB_DIR
        )
        
        # STABILITY CONSTRAINT: ChromaDB uses SQLite under the hood. 
        # Inserting >500 documents simultaneously triggers SQLite's maximum variable limit
        # and causes OperationalError or OOM crashes. Batching is strictly required.
        BATCH_SIZE = 500
        for i in range(0, len(chunked_docs), BATCH_SIZE):
            batch = chunked_docs[i:i + BATCH_SIZE]
            vectorstore.add_documents(batch)
            print(f"[{repo_id}] Inserted batch {i//BATCH_SIZE + 1}...")

        print(f"[{repo_id}] Indexing completed.")
        
        # ASYNC STATE SYNC: This is a webhook pattern. Since indexing takes time, 
        # we ping the Node.js backend when finished to transition the repo status from "processing" to "completed".
        node_api_url = os.getenv("NODE_API_URL", "http://localhost:5000/api/v1")
        requests.patch(f"{node_api_url}/repos/{repo_id}/status", json={"status": "completed"})

    except Exception as e:
        print(f"[{repo_id}] ChromaDB error: {e}")
        try:
            # Fallback webhook: Ensure the frontend isn't left hanging in a "processing" state indefinitely if mapping fails.
            node_api_url = os.getenv("NODE_API_URL", "http://localhost:5000/api/v1")
            requests.patch(f"{node_api_url}/repos/{repo_id}/status", json={"status": "failed"})
        except Exception:
            pass

def delete_vector_collection(repo_id: str):
    """Deletes the ChromaDB collection when a user deletes a repository."""
    try:
        # DATA LIFECYCLE: Orphaned vector spaces consume disk space and memory. 
        # This must be called immediately when the relational/NoSQL record is destroyed in the main backend.
        vectorstore = Chroma(
            collection_name=f"repo_{repo_id}",
            embedding_function=embeddings,
            persist_directory=CHROMA_DB_DIR 
        )
        vectorstore.delete_collection()
        print(f"[{repo_id}] Deleted ChromaDB collection.")
    except Exception as e:
        print(f"[{repo_id}] Failed to delete collection: {e}")