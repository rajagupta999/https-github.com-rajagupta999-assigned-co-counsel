import os
import sys
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import PyPDF2

# ══════════════════════════════════════════════════════════════════
# SOVEREIGN AGENT: Your Local Document Brain
# ══════════════════════════════════════════════════════════════════
# Runs locally on your Mac/PC.
# Indexes your ~/Documents/Cases folder.
# Never uploads files to the cloud.
# Answers questions from the Cloud App via secure tunnel.

app = Flask(__name__)
client = chromadb.Client(Settings(persist_directory="./chroma_db", chroma_db_impl="duckdb+parquet"))
collection = client.get_or_create_collection(name="local_cases")
model = SentenceTransformer('all-MiniLM-L6-v2') # Lightweight local model

CASES_DIR = os.path.expanduser("~/Documents/Cases")

def index_files():
    """Scans CASES_DIR and indexes new PDFs."""
    print(f"📂 Scanning {CASES_DIR}...")
    count = 0
    for root, _, files in os.walk(CASES_DIR):
        for file in files:
            if file.lower().endswith(".pdf"):
                path = os.path.join(root, file)
                try:
                    reader = PyPDF2.PdfReader(path)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() + "\n"
                    
                    # Store chunks
                    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
                    ids = [f"{file}_{i}" for i in range(len(chunks))]
                    embeddings = model.encode(chunks).tolist()
                    metadatas = [{"source": file, "path": path} for _ in chunks]
                    
                    collection.add(
                        documents=chunks,
                        embeddings=embeddings,
                        metadatas=metadatas,
                        ids=ids
                    )
                    count += 1
                    print(f"✅ Indexed: {file}")
                except Exception as e:
                    print(f"❌ Error reading {file}: {e}")
    return count

@app.route('/query', methods=['POST'])
def query():
    """Cloud App asks a question -> Local Agent answers from local files."""
    data = request.json
    question = data.get('question')
    print(f"❓ Question received: {question}")
    
    # Semantic Search
    query_embedding = model.encode([question]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )
    
    context = "\n".join(results['documents'][0])
    sources = [m['source'] for m in results['metadatas'][0]]
    
    # Return snippet + sources (No file upload!)
    return jsonify({
        "answer_snippet": context,
        "sources": list(set(sources))
    })

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "online", "indexed_docs": collection.count()})

if __name__ == '__main__':
    print("🚀 Sovereign Agent Starting...")
    print("1. Indexing your local files (this stays on your machine)...")
    num = index_files()
    print(f"✨ Indexed {num} documents.")
    print("2. Listening for secure Cloud App queries on port 5000.")
    app.run(port=5000)
