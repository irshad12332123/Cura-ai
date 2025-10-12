import { MdDelete } from "react-icons/md";

interface NavBarProps {
  setChats: React.Dispatch<
    React.SetStateAction<{ message: string; messageFrom: "Bot" }[]>
  >;
}

function NavBar({ setChats }: NavBarProps) {
  const handleClearChat = () => {
    setChats([
      { message: "Hey! How can I help you today?", messageFrom: "Bot" },
    ]);
  };

  return (
    <div>
      <ul className="flex justify-between items-center">
        <li className="text-gray-50 text-xl">
          <strong className="text-5xl text-white">C</strong>ura A{" "}
          <strong className="text-7xl text-shadow-xs text-shadow-teal-600 font-bold text-[#08e2ff]">
            i
          </strong>
        </li>

        <li>
          <button
            className="px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(10,147,150,0.6)] py-3 bg-gradient-to-r from-[#000c0f] to-[#051217] 
                  text-center     text-white rounded-2xl cursor-pointer shadow-2xl"
            onClick={handleClearChat}
          >
            <MdDelete className="inline-block text-3xl" />
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
