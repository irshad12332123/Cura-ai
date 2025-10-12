import requests
from colorama import Fore, Style

API_URL = "http://127.0.0.1:5000/ask"

def ask_question():
    query = input("\n🤖 Ask your medical question: ")

    response = requests.post(API_URL, json={"query": query})

    if response.status_code == 200:
        data = response.json()
        print("\n✅ Answer:")
        print(Fore.GREEN + data["answer"] + Style.RESET_ALL)

        print("\n📚 Sources:")
        for src in data["sources"]:
            # Handle dict (FAISS metadata) or string (fallback)
            if isinstance(src, dict):
                print(Fore.LIGHTYELLOW_EX + f"- {src.get('id', 'Unknown source')}" + Style.RESET_ALL)
            else:
                print(Fore.LIGHTYELLOW_EX + f"- {src}" + Style.RESET_ALL)
    else:
        print("❌ Error:", response.json())

if __name__ == "__main__":
    ask_question()
