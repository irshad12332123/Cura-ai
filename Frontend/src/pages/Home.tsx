import React, { useState } from "react";
import { useAuth } from "../context/authProvider";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [value, setValue] = useState<string>("")

  const chatHistory = [
    "How to propose a girl",
    "Solve this bug I’m encountering",
    "What is the total percentage?",
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className=" flex h-screen overflow-hidden bg-gray-200">
      <div className="p-5">

      <SideBar handleClick={handleLogout} history={chatHistory} />
      </div>

      <section className="flex flex-col flex-1">
        <div className="flex overflow-y-auto ">

          <div className=" py-6 space-y-6">
          <ChatMessage messageFrom="You" message="What is the full form of CPU?" />
          <ChatMessage messageFrom="Local AI" message="CPU stands for Central Processing Unit." />
          <ChatMessage messageFrom="You" message="Explain how it works." />
          <ChatMessage messageFrom="Local AI" message="It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system... It processes all instructions in a computer system...vIt processes all instructions in a computer system...It processes all instructions in a computer system... It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system...It processes all instructions in a computer system..." />
        </div>
        </div>
        <div className="flex justify-center w-full relative mb-20">

      <ChatInput inputType="text" value={value} placeholder="Ask me anything" setValue={setValue}/>
        </div>
      </section>
    </main>
  );
}

export default Home;
