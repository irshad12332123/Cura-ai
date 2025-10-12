import React from "react";
import CardButton from "./CardButton";
import CustomCardContainer from "./CustomCardContainer";
import { FiLogOut } from "react-icons/fi";

interface Props {
  handleClick?: () => void;
  history?: string[];
}

function SideBar({ handleClick, history }: Props) {
  return (
    <aside className=" rounded-xl h-screen w-72 bg-gradient-to-tr from-[#0059a754] to-[#FFFDE4] flex flex-col justify-between p-4 ">
      <div>
        <h5 className="text-3xl font-extrabold mb-8 text-gray-800">LOCAL AI</h5>

        <CardButton />

        <div className="mt-8">
          <h5 className="font-semibold text-gray-700 mb-4">
            CONVERSATIONS ({history?.length ?? 0})
          </h5>
          <div className="overflow-y-auto max-h-[65vh]">
            <CustomCardContainer cardItems={history ?? []} />
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="group flex items-center justify-center gap-2 text-white bg-[#202020] hover:bg-[#303030] transition-all duration-200 p-3 rounded-xl"
      >
        <FiLogOut className="text-lg" />
        <span className="group-hover:scale-105 transition-transform">Log Out</span>
      </button>
    </aside>
  );
}

export default SideBar;
