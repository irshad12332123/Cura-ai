import React from "react";
import { CiUser } from "react-icons/ci";
import { TbMessageChatbot } from "react-icons/tb";

interface Props {
  message: string;
  messageFrom: "You" | "Local AI";
}

function ChatMessage({ message, messageFrom }: Props) {
  const isUser = messageFrom === "You";

  return (
    <div className={`flex gap-3 items-start `}>
      {isUser ? (
        <CiUser className="text-4xl text-gray-700 bg-gradient-to-tr from-[#0059a77b] to-[#FFFDE4] p-1 rounded-full" />
      ) : (
        <TbMessageChatbot className="text-4xl text-gray-700 bg-gray-100 p-1 rounded-full" />
      )}

      <div
        className={`flex flex-col w-3/4 md:w-2/3 p-3 rounded-2xl ${
          isUser
            ? "bg-white border border-gray-200"
            : "bg-gradient-to-tr from-[#0059a754] to-[#FFFDE4]"
        }`}
      >
        <h5 className="font-semibold text-lg mb-1">{messageFrom}</h5>
        <p className="text-sm leading-6 text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
