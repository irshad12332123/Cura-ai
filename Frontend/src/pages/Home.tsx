import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "../components/ChatMessage";
import NavBar from "./NavBar";
import CustomInput from "../components/CustomInput";
import { BsSendFill } from "react-icons/bs";
import BlobAnimation from "../components/BlobAnimation";



function Home() {
  const [messages, setMessages] = useState([
    { message: "Hey! How can I help you today?", messageFrom: "Bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { message: input, messageFrom: "User" as const },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
const res = await fetch("http://localhost:3000/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: input }), 
});

      const data = await res.json();
      console.log(data.result.answer);
      
      const result = await data.result.answer;

      setMessages([
        ...newMessages,
        {
          message: result || "Sorry, I didn’t get that.",
          messageFrom: "Bot" as const,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { message: "Error connecting to server.", messageFrom: "Bot" as const },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="  py-2 px-80 bg-gradient-to-bl from-[#232e2f] via-[#051517] to-[#000000] h-screen w-full flex flex-col">
                         
      <main className="px-4   border-teal-900 border-x-2 flex flex-col h-full">

        <NavBar setChats={setMessages} />
        <div className="flex-1 overflow-y-auto mt-10 space-y-6 scrollbar-thumb-[#0a9396]/40" style={{scrollbarWidth: "none"}}>
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.message}
              messageFrom={msg.messageFrom}
            />
          ))}

          {loading && <ChatMessage message="Typing..." messageFrom="Bot" />}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className=" flex items-center gap-3 justify-between bg-[#0b1c1d] text-white pl-7 pr-2 py-4 rounded-xl">
          
          <CustomInput
            inputType="text"
            placeholder="Type your message..."
            value={input}
            handleKeyPress={handleKeyPress}
            setValue={setInput}
          />
          <BsSendFill
            onClick={handleSend}
            className="text-white p-3 bg-black text-5xl rounded-2xl cursor-pointer hover:bg-gradient-to-r from-[#103b41] to-[#0a9396] transition-all duration-500"
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
