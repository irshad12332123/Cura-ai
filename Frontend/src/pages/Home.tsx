import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "../components/ChatMessage";
import NavBar from "./NavBar";
import CustomInput from "../components/CustomInput";
import { useAuth } from "../context/authProvider";
import useChatHistory from "../hooks/useChatHistory";
import { BsSendFill } from "react-icons/bs";
import "../App.css";
function Home() {
  const { user, accessToken } = useAuth();
  if (!user)
    return <div className="text-white p-10">Please log in to continue.</div>;

  const userId = user.id;
  const token = accessToken!;

  const { history, fetchHistory, clearHistory } = useChatHistory(userId, token);

  useEffect(() => {
    fetchHistory();
  }, []);

  const [messages, setMessages] = useState([
    { message: "Hey! How can I help you today?", messageFrom: "Bot" },
  ]);

  useEffect(() => {
    if (history.length === 0) {
      setMessages([
        { message: "Hey! How can I help you today?", messageFrom: "Bot" },
      ]);
    } else {
      const formatted = history.map((h) => ({
        message: h.message,
        messageFrom: h.sender,
      }));
      setMessages(formatted);
    }
  }, [history]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { message: input, messageFrom: "User" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    await fetch("http://localhost:3000/api/history/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: input, sender: "User" }),
    });

    const contextForBackend = newMessages.map((m) => ({
      role: m.messageFrom === "User" ? "user" : "assistant",
      content: m.message,
    }));

    try {
      const res = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: input,
          context: contextForBackend,
          userId,
        }),
      });

      const data = await res.json();
      const result = data.result.reply;

      setMessages([
        ...newMessages,
        { message: result || "Sorry, I didn’t get that.", messageFrom: "Bot" },
      ]);

      await fetch("http://localhost:3000/api/history/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: result, sender: "Bot" }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0f1a0f] flex flex-col items-center p-4">
      {/* CHAT WINDOW */}
      <div className="w-full max-w-6xl h-full bg-[#0c140c] rounded-3xl shadow-xl border border-[#1e2b1e] flex flex-col">
        {/* HEADER */}
        <NavBar setChats={setMessages} clearHistory={clearHistory} />

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 chat">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.message}
              messageFrom={msg.messageFrom}
            />
          ))}

          {loading && <ChatMessage message="Preparing...." messageFrom="Bot" />}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT SECTION */}
        <div className="px-6 py-5 bg-[#0c140c] rounded-b-3xl flex items-center chat">
          <div className="relative w-full">
            <div className="bg-[#111c11] border border-[#1e2b1e] rounded-full px-6 py-3 flex items-center">
              <CustomInput
                inputType="text"
                placeholder="Type your message..."
                value={input}
                handleKeyPress={(e) => e.key === "Enter" && handleSend()}
                setValue={setInput}
                customStyles="bg-transparent text-white outline-none"
              />
            </div>

            {/* SEND BUTTON */}
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#2ecc71] hover:bg-[#27ae60] transition p-3 rounded-full shadow-lg"
            >
              <BsSendFill className="text-black text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
