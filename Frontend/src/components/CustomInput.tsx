import React from 'react'

interface InputProps {
  inputType: string,
  value?: string,
  placeholder?: string,
  setValue?: any
}
function CustomInput({ value, placeholder, setValue, inputType }: InputProps) {
  return (
    <input 
    type={inputType} 
    placeholder={placeholder} 
    onChange={(e) => setValue(e.target.value)}
    value={value}
    className='w-full h-15 p-5 text-white border-b-1 border-[rgba(189,180,205,0.35)] border-l-1 rounded-4xl  shadow-[0_0_10px_rgba(153,140,175,0.20)] '
    />
  )
}

export default CustomInput
