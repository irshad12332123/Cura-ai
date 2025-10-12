import { IoAlert } from "react-icons/io5";
function NavBar() {
  const handleClearChat = ({  }) => {};
  return (
    <div className="">
      <ul className=" flex justify-between items-center">
        <li className="text-gray-50 text-xl "> 
          <strong className="text-5xl text-white">C</strong>ura A <strong className="text-7xl text-shadow-xs text-shadow-teal-600 font-bold text-[#08e2ff]">i</strong>
        </li>
        <li>
          <button className="px-6 py-3 bg-black text-white rounded-full" onClick={handleClearChat}>Clear Chat</button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
