import React from 'react'
import { FiEdit } from "react-icons/fi";

function CardButton() {
  return (
    <div className='flex bg-[#202020] p-3 cursor-pointer rounded-xl justify-between items-center'>
      <button className='text-white '>
        New Chat
      </button>
      <FiEdit className='text-white' />
    </div>
  )
}
export default CardButton
