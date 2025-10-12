from flask import Flask, request, jsonify
import subprocess
import re

app = Flask(__name__)

# 🧹 Clean user query
def clean_input(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s?.!,]', '', text)     # remove emojis/symbols
    text = re.sub(r'\s+', ' ', text)            # remove extra spaces
    return text

# 🧼 Clean Ollama response
def clean_answer(text: str) -> str:
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"[-•]", "", text)
    text = re.sub(r"\b\d+[\.\)]\s*", "", text)
    text = re.sub(r"\n\s*\n", "\n", text)
    return text.strip()

conversation_history = []  # store short-term context (last few Q&A)

# 🧠 Ask Ollama model
def ask_ollama(query: str) -> str:
    """
    Multi-stage prompt: context → fallback general knowledge → enhanced cure/prevention advice
    """
    global conversation_history
    try:
        context = "\n".join(conversation_history[-3:]) if conversation_history else ""

        # ---- 1️⃣ Context-based attempt ----
        strict_prompt = f"""
You are Cura AI, a factual and empathetic medical assistant.
Use ONLY the context below to answer the user's question.
If context lacks information, reply exactly: "CONTEXT_INSUFFICIENT".

Context:
{context if context else '[no context]'}

User Question: {query}

Answer clearly, like a doctor explaining to a patient.
"""
        print("🤔 Asking model (context-first)...")
        process = subprocess.Popen(
            ["ollama", "run", "gemma:2b"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="ignore"
        )
        stdout, stderr = process.communicate(input=strict_prompt, timeout=120)
        response = (stdout or "").strip()

        # ---- 2️⃣ Fallback: General knowledge with cure & prevention ----
        if not response or "context_insufficient" in response.lower():
            fallback_prompt = f"""
You are Cura AI, a medical knowledge assistant.
Answer the user's question in a complete, structured, and easy-to-understand format.

Include these sections:
1. **Definition / Explanation** — what it is
2. **Common Causes**
3. **Symptoms**
4. **Treatment / Cure methods** — include home remedies and lifestyle tips
5. **Prevention** — how to avoid or manage it
6. **Common Medicines** (general, over-the-counter examples only)
7. **Disclaimer:** This information is for educational purposes only. Always consult a licensed doctor.

User Question: {query}
"""
            print("⚕️ Context insufficient — retrying with medical detail mode...")
            process2 = subprocess.Popen(
                ["ollama", "run", "gemma:2b"],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8",
                errors="ignore"
            )
            stdout2, stderr2 = process2.communicate(input=fallback_prompt, timeout=120)
            response = (stdout2 or "").strip()

        # Save context for future Q&A
        conversation_history.append(f"User: {query}\nAI: {response}")

        return clean_answer(response) if response else "⚠️ No answer received."

    except subprocess.TimeoutExpired:
        return "⚠️ Model timed out. Try again later."
    except Exception as e:
        return f"⚠️ Error: {str(e)}"

# 🌐 Flask endpoint
@app.route("/ask", methods=["POST"])
def ask():
    print("Ask Endpoint Hit From flask")
    data = request.get_json()
    print(data)
    user_query = data.get("query", "")
    print(user_query)


    if not user_query.strip():
        return jsonify({"error": "Empty query"}), 400

    clean_query = clean_input(user_query)
    answer = ask_ollama(clean_query)

    response = {
        "query": user_query,
        "clean_query": clean_query,
        "answer": answer
    }
    return jsonify(response)

# 🚀 Run server
if __name__ == "__main__":
    app.run(debug=True)