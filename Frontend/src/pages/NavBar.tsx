import { useAuth } from "../context/authProvider";
import { FaRobot } from "react-icons/fa";

interface Props {
  setChats: any;
  clearHistory: () => void;
}

function NavBar({ setChats, clearHistory }: Props) {
  const { logout, user } = useAuth();

  return (
    <header className="w-full bg-[#0c140c] rounded-t-3xl border-b border-[#1e2b1e] px-4 py-3 flex justify-between items-center">
      {/* LEFT SECTION – ICON + TITLE */}
      <div className="flex items-center gap-3">
        <div className="bg-[#1e2b1e] p-3 rounded-full shadow-md flex items-center justify-center">
          <FaRobot className="text-[#2ecc71] text-xl" />
        </div>

        <h1 className="text-white text-lg font-semibold">
          {user?.username || "AI Assistant"}
        </h1>
      </div>

      {/* RIGHT SECTION – DELETE + LOGOUT */}
      <div className="flex items-center gap-3">
        {/* DELETE CHAT */}
        <button
          onClick={() => {
            setChats([]);
            clearHistory();
          }}
          className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded-full transition border border-[#333]"
        >
          Delete Chat
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-black rounded-full font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default NavBar;
