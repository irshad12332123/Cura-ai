import json
import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

CHUNKS_FILE = "chunks.jsonl"
INDEX_FILE = "faiss.index"
META_FILE = "metadata.pkl"

def main():
    print("📥 Loading chunks...")
    chunks = []
    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)
            chunks.append({
                "id": obj["id"],
                "text": obj["text"]   # ✅ ensure we keep the text
            })

    print(f"✅ Loaded {len(chunks)} chunks")

    # Load model
    print("🔄 Loading SentenceTransformer model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts, show_progress_bar=True).astype("float32")

    # Build FAISS index
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    # Save index + metadata
    faiss.write_index(index, INDEX_FILE)
    with open(META_FILE, "wb") as f:
        pickle.dump(chunks, f)

    print(f"✅ FAISS index saved to {INDEX_FILE}")
    print(f"✅ Metadata saved to {META_FILE}")

if __name__ == "__main__":
    main()
