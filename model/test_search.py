import requests

API_URL = "http://127.0.0.1:5000/ask"

while True:
    query = input("\n🤖 Ask your medical question (or type 'exit' to quit): ")
    if query.lower() in ["exit", "quit"]:
        break

    try:
        response = requests.post(API_URL, json={"query": query})
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Answer:\n", data.get("answer", "⚠️ No answer"))
            print("\n📚 Sources:", data.get("sources", []))
        else:
            print("⚠️ Error:", response.status_code, response.text)
    except Exception as e:
        print("⚠️ Request failed:", e)
