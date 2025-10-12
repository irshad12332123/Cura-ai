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
def clean_answer(raw_response: str) -> str:
    """
    Clean and format AI response: Add newlines after periods, fix sections, trim junk.
    """
    if not raw_response:
        return raw_response
    
    # Step 1: Trim extra whitespace and fix common issues
    cleaned = raw_response.strip()
    cleaned = re.sub(r'\n\s*\n', '\n\n', cleaned)  # Collapse multiple newlines to 2
    cleaned = re.sub(r'[.?!]\s*([A-Z])', r'.\n\n\1', cleaned)  # Newline after sentences (e.g., after . or !)
    
    # Step 2: Ensure sections have colons if missing (basic regex for headers)
    # Looks for bold-like patterns (**Header**) and adds : if absent
    cleaned = re.sub(r'\*\*(.*?)\*\*(\s*)([A-Z])', r'**\1:**\2\3', cleaned)
    
    # Step 3: Bullet points for lists (if prompt uses -, add indents/newlines)
    cleaned = re.sub(r'-\s*([a-zA-Z])', r'\n- \1', cleaned)
    
    # Step 4: Final trim and ensure disclaimer at end
    if not cleaned.endswith('Disclaimer'):
        cleaned += "\n\n**Disclaimer:** This information is for educational purposes only. Always consult a licensed doctor."
    
    
    return cleaned
conversation_history = []  # store short-term context (last few Q&A)

# 🧠 Ask Ollama model
def ask_ollama(query: str) -> str:
    """
    Multi-stage prompt: optional context → fallback general knowledge → enhanced cure/prevention advice
    """
    global conversation_history
    try:
        context = "\n".join(conversation_history[-3:]) if conversation_history else ""

        # NEW: Quick check if query seems unrelated to prior context (e.g., no keywords from last message)
        last_topic = conversation_history[-1].lower() if conversation_history else ""
        query_lower = query.lower()
        use_context = any(word in query_lower for word in ["it", "this", "that", "harmful", "cause"])  # Add words that imply reference to prior chat
        if last_topic and not use_context:  # If no reference words, skip strict context
            print("🆕 New topic detected — skipping strict context.")
            context = ""  # Clear context for fresh start

        # ---- 1️⃣ Context-based attempt (only if relevant) ----
        if context:  # Only run if we decided to use context
            strict_prompt = f"""
You are Cura AI, a factual and empathetic medical assistant.
Use ONLY the context below to answer the user's question.
If context lacks information, reply exactly: "CONTEXT_INSUFFICIENT".

Context:
{context}

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

            # UPDATED: Broader check for failure (catches "context does not provide..." too)
            failure_keywords = ["context_insufficient", "context does not provide", "cannot answer", "no information in context"]
            if not response or any(keyword in response.lower() for keyword in failure_keywords):
                response = ""  # Force fallback
        else:
            response = ""  # No context, so skip to fallback

        # ---- 2️⃣ Fallback: General knowledge with cure & prevention ----
        if not response:
            fallback_prompt = f"""
            You are Cura AI, a medical knowledge assistant.
            Answer the user's question in a STRICTLY STRUCTURED FORMAT. Use EXACTLY these sections with bold headers, colons, and new lines.

            Format EVERY response like this:
            Definition / Explanation: [Short clear explanation here.]

            Common Causes: [List 3-5 causes, bullet points with new lines.]

            Symptoms: [List 3-5 symptoms, bullet points with new lines.]

            Treatment / Cure methods: [Explain options, include 2-3 home remedies. Use new lines.]

            Prevention: [3-5 tips, bullet points.]

            Common Medicines: [2-3 over-the-counter examples, with colons like "Ibuprofen: For pain."]

            Disclaimer: This information is for educational purposes only. Always consult a licensed doctor.

            User Question: {query}

            Keep each section short (1-3 sentences). Use : after headers. Add a blank line (new line) after each section.
            """
            print("⚕️ Using medical detail mode (fallback or new topic)...")
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
    print(answer)

    response = {
        "query": user_query,
        "clean_query": clean_query,
        "answer": answer
    }
    return jsonify(response)

# 🚀 Run server
if __name__ == "__main__":
    app.run(debug=True)