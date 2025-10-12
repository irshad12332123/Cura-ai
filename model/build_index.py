import faiss
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer

# 📂 Folder containing WHO text files
DATA_FOLDER = "who_texts"

# 🔹 Load SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text):
    """Generate embeddings using SentenceTransformers"""
    return model.encode([text])[0]

texts = []
metadata = []

# 🔹 Read all text files
for fname in os.listdir(DATA_FOLDER):
    if fname.endswith(".txt"):
        with open(os.path.join(DATA_FOLDER, fname), "r", encoding="utf-8") as f:
            content = f.read()

            # Simple split into chunks (500 characters)
            chunks = [content[i:i+500] for i in range(0, len(content), 500)]

            for i, chunk in enumerate(chunks):
                texts.append(chunk)
                metadata.append({"id": f"{fname}_{i}", "text": chunk})

print(f"📄 Loaded {len(texts)} chunks from WHO documents")

# 🔹 Convert to embeddings using SentenceTransformers
embeddings = np.array([embed_text(text) for text in texts], dtype="float32")

# 🔹 Build FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# 🔹 Save index + metadata
faiss.write_index(index, "faiss_index.bin")
with open("faiss_metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)

print("✅ FAISS index and metadata saved!")
