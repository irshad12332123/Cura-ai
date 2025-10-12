import os
import json

# CONFIG
DATA_DIR = "data"         # where raw WHO text files are stored
OUTPUT_FILE = "chunks.jsonl"
CHUNK_SIZE = 300          # words per chunk (tweak later)
CHUNK_OVERLAP = 50        # overlapping words between chunks

def clean_text(text: str) -> str:
    """Basic cleaning of text."""
    text = text.replace("\n", " ").replace("\t", " ")
    text = " ".join(text.split())  # remove multiple spaces
    return text

def chunk_text(text: str, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def main():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".txt"):
                filepath = os.path.join(DATA_DIR, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    text = clean_text(f.read())

                chunks = chunk_text(text)
                for i, chunk in enumerate(chunks):
                    record = {
                        "id": f"{filename}_{i}",
                        "text": chunk
                    }
                    out.write(json.dumps(record) + "\n")

    print(f"✅ Finished! Saved chunks to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
