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
      className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {isUser ? (
        <CiUser className="w-10 h-10 text-white bg-black rounded-full p-2" />
      ) : (
        <TbRibbonHealth className="w-10 h-10 text-gray-700 bg-gray-100 rounded-full p-2" />
      )}

      {/* Bubble */}
      <div
        className={`
          max-w-[75%] 
          p-3 
          rounded-2xl 
          text-white 
          shadow-xl 
          ${isUser ? "bg-[#1e8f3d]" : "bg-[#103b41]"} 
        `}
      >
        <p className="text-base leading-6 whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
