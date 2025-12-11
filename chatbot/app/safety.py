# app/safety.py

SELF_HARM_KEYWORDS = [
    "kill myself", "suicide", "end my life", "hurt myself",
    "self harm", "cut myself", "want to die"
]

NON_MEDICAL_TOPICS = [
    "react", "javascript", "coding", "google", "elon musk",
    "movie", "football", "cricket", "business", "actor",
    "actress", "ceo", "tiktok", "politics"
]

def is_self_harm(text: str):
    t = text.lower()
    return any(word in t for word in SELF_HARM_KEYWORDS)

def is_non_medical(text: str):
    t = text.lower()
    return any(word in t for word in NON_MEDICAL_TOPICS)
