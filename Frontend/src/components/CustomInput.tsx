import React from 'react'

interface InputProps {
  inputType: string,
  value?: string,
  placeholder?: string,
  setValue?: any
  handleKeyPress?: any
}
function CustomInput({ value, placeholder, setValue, inputType, handleKeyPress }: InputProps) {
  return (

    <input 
    type={inputType} 
    placeholder={placeholder} 
    onChange={(e) => setValue(e.target.value)}
    value={value}
    onKeyDown={handleKeyPress}
    className='w-full focus:outline-none  focus:border-teal-500'
    />
  )
  
}

export default CustomInput