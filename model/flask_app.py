from flask import Flask, request, jsonify
import faiss
import json
import os
import numpy as np
import subprocess
import re
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

# 🔹 Toggle FAISS usage
USE_FAISS = False   # set True if you want FAISS + RAG, False for Ollama-only

# 📥 Load FAISS index + metadata (only if needed)
if USE_FAISS:
    print("📥 Loading FAISS index + metadata...")
    if not os.path.exists("faiss_index.bin") or not os.path.exists("faiss_metadata.json"):
        raise FileNotFoundError("❌ FAISS index or metadata not found. Run build_index.py first.")

    index = faiss.read_index("faiss_index.bin")

    with open("faiss_metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)

    # 🔹 Load embedding model
    embedder = SentenceTransformer("all-MiniLM-L6-v2")

    def embed_text(text):
        try:
            return embedder.encode([text])[0].astype("float32")
        except Exception as e:
            print("⚠️ Embedding error:", e)
            return None
else:
    index, metadata, embedder = None, None, None


# 🔹 Clean Ollama output
def clean_answer(text: str) -> str:
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)   # remove bold
    text = re.sub(r"\*(.*?)\*", r"\1", text)       # remove bullet stars
    text = re.sub(r"\n\s*\n", "\n", text)          # collapse blank lines
    return text.strip()


# 🔹 Generate answer with Ollama
def generate_answer(query, retrieved_docs=None):
    if USE_FAISS and retrieved_docs:
        context = "\n".join([doc["text"] for doc in retrieved_docs])
        prompt = f"""
You are a helpful medical assistant.
Answer the following question strictly based on the given context.
If the context is not useful, answer from your own knowledge.

Question: {query}
Context:
{context}

Answer:
"""
    else:
        prompt = f"""
You are a helpful medical assistant.
Answer the following question from your knowledge.

Question: {query}

Answer:
"""

    try:
        print("🤖 Generating answer with Ollama (gemma:2b)...")

        # ✅ Force UTF-8 to avoid charmap errors on Windows
        process = subprocess.Popen(
            ["ollama", "run", "gemma:2b"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="ignore"
        )
        stdout, stderr = process.communicate(input=prompt, timeout=60)

        print("🔎 RAW OLLAMA STDOUT START")
        print(stdout)
        print("🔎 RAW OLLAMA STDOUT END")

        if stderr:
            print("🔎 RAW OLLAMA STDERR:", stderr)

        raw_output = stdout.strip()

        # Retry with only query if nothing came back
        if not raw_output:
            print("⚠️ Empty output. Retrying with query only...")
            fallback = subprocess.Popen(
                ["ollama", "run", "gemma:2b"],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8",
                errors="ignore"
            )
            stdout2, stderr2 = fallback.communicate(input=query, timeout=60)
            raw_output = stdout2.strip()

            print("🔎 FALLBACK STDOUT START")
            print(stdout2)
            print("🔎 FALLBACK STDOUT END")
            if stderr2:
                print("🔎 FALLBACK STDERR:", stderr2)

        return clean_answer(raw_output) if raw_output else "⚠️ No answer generated."

    except subprocess.TimeoutExpired:
        process.kill()
        return "⚠️ Timeout: Ollama took too long to respond."
    except Exception as e:
        print("⚠️ Generation error:", e)
        return f"I couldn’t generate an answer right now. Error: {str(e)}"


# 🔹 API endpoint
@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    retrieved_docs = []
    if USE_FAISS:
        # 1️⃣ Embed query
        query_vector = embed_text(query)
        if query_vector is None:
            return jsonify({"error": "Embedding failed"}), 500

        # 2️⃣ Search FAISS
        k = 3
        D, I = index.search(np.array([query_vector]), k)
        retrieved_docs = [metadata[idx] for idx in I[0] if idx != -1]

    # 3️⃣ Generate Answer
    answer = generate_answer(query, retrieved_docs if USE_FAISS else None)

    return jsonify({
        "query": query,
        "answer": answer,
        "sources": retrieved_docs if (USE_FAISS and retrieved_docs) else ["⚠️ No FAISS used – answered directly from Ollama"]
    })


if __name__ == "__main__":
    app.run(debug=True)
