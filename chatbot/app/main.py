from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import ValidationError

from .models import ChatRequest
from .prompt_manager import build_prompt
from .openai_client import chat_completion, moderate_text
from .moderation import evaluate_safety
from .utils import clean_response

app = Flask(__name__)
CORS(app)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json

    # Validate input with Pydantic
    try:
        req = ChatRequest(**data)
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

    user_msg = req.message

    # ---- MODERATION CHECK ----
    mod = moderate_text(user_msg)
    safety_action = evaluate_safety(mod)

    if safety_action and safety_action["block"]:
        return jsonify({
            "reply": safety_action["message"],
            "moderated": True
        }), 200

    # ---- BUILD PROMPT ----
    messages = build_prompt(req.message, req.context)

    # ---- GENERATE RESPONSE ----
    reply = chat_completion(messages)

    if not reply:
        return jsonify({
            "reply": "Sorry — I'm having trouble generating a response right now.",
            "moderated": False
        }), 200

    reply = clean_response(reply)

    return jsonify({
        "reply": reply,
        "moderated": False
    })


@app.route("/health")
def health():
    return jsonify({"status": "ok"})
from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import ValidationError

from .models import ChatRequest
from .prompt_manager import build_prompt
from .openai_client import chat_completion, moderate_text
from .moderation import evaluate_safety
from .utils import clean_response

app = Flask(__name__)
CORS(app)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json

    # Validate input with Pydantic
    try:
        req = ChatRequest(**data)
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

    user_msg = req.message

    # ---- MODERATION CHECK ----
    mod = moderate_text(user_msg)
    safety_action = evaluate_safety(mod)

    if safety_action and safety_action["block"]:
        return jsonify({
            "reply": safety_action["message"],
            "moderated": True
        }), 200

    # ---- BUILD PROMPT ----
    messages = build_prompt(req.message, req.context)

    # ---- GENERATE RESPONSE ----
    reply = chat_completion(messages)

    if not reply:
        return jsonify({
            "reply": "Sorry — I'm having trouble generating a response right now.",
            "moderated": False
        }), 200

    reply = clean_response(reply)

    return jsonify({
        "reply": reply,
        "moderated": False
    })


@app.route("/health")
def health():
    return jsonify({"status": "ok"})
