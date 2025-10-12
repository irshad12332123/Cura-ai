import React from 'react'

interface ButtonProps {
  value?: string,
  handleClick?: any,
  type?: string,
  btnType?: "submit" | "reset" | "button" | undefined,
}
function CustomButtton({ value, handleClick, type, btnType }: ButtonProps) {


  return (
    <button type={btnType}  className={`text-white cursor-pointer text-xl
     py-5 px-2 rounded-4xl w-full ${type=="secondary"?" border-1 border-[#46ecd654] transition-all duration-300 hover:shadow-[0_0_25px_rgba(70,236,214,0.33)] shadow-[0_0_10px_rgba(70,236,214,0.33)] bg-[#46ecd622]":""}`} onClick={handleClick}>
        {value}
    </button>
  )
}

export default CustomButtton
