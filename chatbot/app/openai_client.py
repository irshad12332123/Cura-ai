from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def chat_completion(messages: list):
    """Call GPT model with messages prompt."""

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=500
        )
        return resp.choices[0].message.content

    except Exception as e:
        print("OpenAI chat error:", e)
        return None


def moderate_text(text: str):
    """Run OpenAI moderation."""
    try:
        result = client.moderations.create(
            model="omni-moderation-latest",
            input=text
        )
        return result.results[0]  # <--- correct structure
    except Exception as e:
        print("Moderation error:", e)
        return None
