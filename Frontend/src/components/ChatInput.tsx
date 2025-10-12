import React from 'react';
import { HiOutlineArrowUp } from "react-icons/hi";

interface InputProps {
  inputType: string;
  value?: string;
  placeholder?: string;
  setValue?: (val: string) => void;
  onSend?: () => void;
}

function ChatInput({ inputType, value, placeholder, setValue, onSend }: InputProps) {
  return (
    <div className="border-1  fixed bottom-2 left-1/2 p-2 rounded-xl  -translate-x-1/2 w-[60%] bg-white  border-gray-600 px-6 flex items-center justify-between">
      <input
        type={inputType}
        placeholder={placeholder}
        onChange={(e) => setValue?.(e.target.value)}
        value={value}
        className="w-full  rounded-xl px-4 py-3 pr-12 text-gray-800 focus:outline-none"
      />

      <button
        onClick={onSend}
        className="absolute right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-2 "
      >
        <HiOutlineArrowUp className="text-2xl" />
      </button>
    </div>
  );
}

export default ChatInput;
