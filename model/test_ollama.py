import subprocess
import re
import asyncio
import edge_tts
import speech_recognition as sr
from datetime import datetime
from colorama import Fore, init
import json
import os
import random
import tempfile
import playsound  # pip install playsound==1.2.2

init(autoreset=True)

# ---------------- MEMORY ----------------
MEMORY_FILE = "conversation_memory.json"

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_memory(history):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history[-10:], f, indent=2, ensure_ascii=False)

conversation_history = load_memory()

# ---------------- CLEANING ----------------
def clean_answer(text: str) -> str:
    """Remove markdown and list formatting safely."""
    if not isinstance(text, str):
        return ""
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text or "")
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"[-•]", "", text)
    text = re.sub(r"\b\d+[\.\)]\s*", "", text)
    text = re.sub(r"\n\s*\n", "\n", text)
    return text.strip()

# ---------------- SAFETY ----------------
def safety_filter(text: str) -> bool:
    unsafe = [
        "suicide", "self-harm", "kill yourself", "overdose",
        "abortion", "murder", "poison", "drug dosage"
    ]
    return not any(word in text.lower() for word in unsafe)

# ---------------- EMOTION DETECTION ----------------
def detect_emotion(text: str):
    text = text.lower()
    if any(x in text for x in ["scared", "afraid", "nervous", "worried"]):
        return "reassure"
    elif any(x in text for x in ["pain", "hurt", "fever", "sick", "weak"]):
        return "care"
    return "neutral"

def empathetic_tone(answer: str, emotion="neutral"):
    if emotion == "reassure":
        extra = "I understand that it can feel worrying, but you’re doing the right thing by checking this."
    elif emotion == "care":
        extra = "Take care of yourself, rest properly, and stay hydrated."
    else:
        extra = random.choice([
            "That’s a common concern — let’s look into it together.",
    "You did the right thing by reaching out for guidance.",
    "It's important to catch these things early, and you’re doing exactly that.",
    "I understand your concern — let’s figure this out calmly.",
    "Health questions like this are worth asking; good thinking.",
    "Your well-being matters, and it's great that you’re checking in."
        ])
    return f"{answer}\n\n{extra}"

# ---------------- CONFIDENCE ----------------
def confidence_estimation(answer: str) -> int:
    keywords = ["likely", "possibly", "may", "suggests"]
    if any(k in answer.lower() for k in keywords):
        return 70
    elif len(answer.split()) > 60:
        return 90
    return 80

# ---------------- DOCTOR RECOMMENDATION ----------------
doctor_map = {
    "chest pain": "Cardiologist",
    "heart": "Cardiologist",
    "shortness of breath": "Pulmonologist",
    "breath": "Pulmonologist",
    "cough": "Pulmonologist / ENT",
    "lungs": "Pulmonologist",
    "rash": "Dermatologist",
    "skin": "Dermatologist",
    "fever": "General Physician (GP)",
    "infection": "General Physician (GP)",
    "stomach": "Gastroenterologist",
    "abdominal": "Gastroenterologist",
    "diarrhea": "Gastroenterologist",
    "headache": "Neurologist (if severe/persistent)",
    "dizziness": "Neurologist / ENT",
    "vision": "Ophthalmologist",
    "eye": "Ophthalmologist",
    "ear": "ENT Specialist",
    "throat": "ENT Specialist",
    "joint": "Orthopedic",
    "bone": "Orthopedic",
    "diabetes": "Endocrinologist",
    "thyroid": "Endocrinologist",
    "anxiety": "Psychiatrist",
    "depression": "Psychiatrist",
    "pregnant": "Obstetrician/Gynecologist (OB/GYN)",
    "period": "Obstetrician/Gynecologist (OB/GYN)",
    "urine": "Urologist",
    "blood in stool": "Colorectal Surgeon / Gastroenterologist"
}

def recommend_doctor(user_text: str):
    """Suggest a doctor based on user symptoms."""
    text = user_text.lower()
    for keyword in sorted(doctor_map.keys(), key=lambda k: -len(k)):
        if keyword in text:
            return f"💡 Recommendation: You may consider seeing a **{doctor_map[keyword]}** for further evaluation."
    return None

# ---------------- SAVE HISTORY ----------------
def save_history(question: str, answer: str, recommendation: str = None):
    with open("qa_history.txt", "a", encoding="utf-8") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"\n[{timestamp}]\nQ: {question}\nA: {answer}\n")
        if recommendation:
            f.write(f"Recommendation: {recommendation}\n")
        f.write(f"{'-'*50}\n")

# ---------------- SPEECH OUTPUT ----------------
async def speak_async(text: str):
    text = re.sub(r'[^\w\s,.!?]', '', text)
    text = re.sub(r"\s+", " ", text).strip()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        temp_audio_path = tmp.name

    communicate = edge_tts.Communicate(
        text,
        voice="en-US-AriaNeural",
        rate="+5%"
    )

    await communicate.save(temp_audio_path)
    playsound.playsound(temp_audio_path, block=True)
    os.remove(temp_audio_path)

def speak(text: str):
    try:
        asyncio.run(speak_async(text))
    except RuntimeError:
        loop = asyncio.get_event_loop()
        loop.create_task(speak_async(text))

# ---------------- SPEECH INPUT ----------------
def listen() -> str:
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print(Fore.YELLOW + "🎙️ Speak your question...")
        audio = recognizer.listen(source)
        try:
            query = recognizer.recognize_google(audio)
            print(Fore.CYAN + f"🗣️ You said: {query}")
            return query
        except sr.UnknownValueError:
            return "⚠️ Could not understand audio"
        except sr.RequestError:
            return "⚠️ Speech service unavailable"

# ---------------- OLLAMA ----------------
def ask_ollama(query: str) -> str:
    global conversation_history
    try:
        context = "\n".join(conversation_history[-3:])
        prompt = f"Context:\n{context}\n\nUser Question: {query}\n\nAnswer clearly, factually, and briefly."

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
        raw_output = stdout.strip()
        if not raw_output:
            return "⚠️ No answer generated."
        return clean_answer(raw_output)
    except Exception as e:
        return f"⚠️ Error: {str(e)}"

# ---------------- MAIN ----------------
if __name__ == "__main__":
    print(Fore.MAGENTA + "\n🤖 Welcome to the AI Medical Brain (v4)")
    print(Fore.MAGENTA + "(type text, say 'voice' for mic, 'exit' to quit)\n")

    while True:
        query = input(">> ").strip()

        if query.lower() in ["exit", "quit"]:
            print(Fore.YELLOW + "👋 Goodbye! Stay safe and healthy.")
            save_memory(conversation_history)
            break

        if query.lower() == "voice":
            query = listen()
            if query.startswith("⚠️"):
                print(Fore.RED + query)
                continue

        conversation_history.append(f"User: {query}")
        answer = ask_ollama(query)

        if not safety_filter(answer):
            print(Fore.RED + "⚠️ Sorry, I cannot provide unsafe medical advice.")
            continue

        emotion = detect_emotion(query)
        answer = empathetic_tone(answer, emotion)
        confidence = confidence_estimation(answer)
        doctor_suggestion = recommend_doctor(query)

        print(Fore.GREEN + f"\n✅ Answer (Confidence: {confidence}%):\n{answer}\n")

        if doctor_suggestion:
            print(Fore.YELLOW + doctor_suggestion)
            # Uncomment below if you want it spoken too
            # speak(doctor_suggestion)

        speak(answer)
        save_history(query, answer, doctor_suggestion)
        conversation_history.append(f"AI: {answer}")
        save_memory(conversation_history)
        print(Fore.BLUE + "📝 Saved to qa_history.txt and memory.json\n")
