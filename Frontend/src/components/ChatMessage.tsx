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
        <CiUser className="text-4xl text-gray-700 bg-white rounded-xl p-1 " />
      ) : (
        <TbRibbonHealth className="text-4xl text-gray-700 bg-gray-100 p-1 rounded-2xl" />
      )}

      <div
        className={`flex flex-col w-auto p-3 rounded-xl ${
          isUser ? "bg-[#000000] " : "bg-[#103b41]"
        }`}
      >
        <p className="text-xl leading-6 text-white px-6">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
