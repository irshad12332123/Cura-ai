import { MdDelete } from "react-icons/md";
import CustomButtton from "../components/CustomButtton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import { CiLogout } from "react-icons/ci";
interface NavBarProps {
  setChats: React.Dispatch<
    React.SetStateAction<{ message: string; messageFrom: "Bot" }[]>
  >;
}

function NavBar({ setChats }: NavBarProps) {

  const navigate = useNavigate();

  const { logout } = useAuth();


  const handleLogOut = () => {
    logout();
    navigate("/login", { replace: true });
  };


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
      <div  className="flex justify-center items-center gap-5">
        <li>
          <button
            className="px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(10,147,150,0.6)] py-3 bg-gradient-to-r from-[#000c0f] to-[#051217] text-center  text-white rounded-2xl cursor-pointer shadow-2xl border border-[rgba(10,147,150,0.6)]"
            onClick={handleClearChat}
          >
            <MdDelete className="inline-block text-3xl" />
          </button>
        </li>
        <button
            className="px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(10,147,150,0.6)] py-3 bg-gradient-to-r from-[#000c0f] to-[#051217] 
                  text-center     text-white rounded-2xl cursor-pointer shadow-2xl border border-[rgba(10,147,150,0.6)]"
            onClick={handleLogOut}
          >
        <CiLogout className="text-3xl text-white" />
          </button>
      </div>
      </ul>
    </div>
  );
}

export default NavBar;
