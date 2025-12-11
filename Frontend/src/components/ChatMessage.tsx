import React from "react";
import { TbRibbonHealth } from "react-icons/tb";
import { CiUser } from "react-icons/ci";

interface Props {
  message: string;
  messageFrom: "User" | "Bot";
}

function ChatMessage({ message, messageFrom }: Props) {
  const isUser = messageFrom === "User";

  return (
    <div
      className={`flex gap-3 items-start ${
        isUser ? "flex-row-reverse text-right" : ""
      }`}
    >
      {isUser ? (
        <CiUser className="w-12 h-12 flex-shrink-0 self-start text-5xl text-white bg-black rounded-xl p-2" />
      ) : (
        <TbRibbonHealth className="w-12 h-12 flex-shrink-0 self-start text-5xl text-gray-700 bg-gray-100 p-2 rounded-2xl" />
      )}

      <div
        className={`flex flex-col w-auto max-w-[70%] p-3 rounded-xl ${
          isUser
            ? "bg-[#020d12] shadow-2xl border border-gray-800"
            : "bg-[#103b41] shadow-2xl border border-gray-500"
        }`}
      >
        <p
          className="text-xl leading-6 text-white"
          style={{ whiteSpace: "pre-line" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;
