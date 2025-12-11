interface InputProps {
  inputType: string;
  value?: string;
  placeholder?: string;
  setValue?: any;
  handleKeyPress?: any;
  customStyles?: any;
}
function CustomInput({
  value,
  placeholder,
  setValue,
  inputType,
  handleKeyPress,
  customStyles,
}: InputProps) {
  return (
    <input
      type={inputType}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      onKeyDown={handleKeyPress}
      className={`w-full focus:outline-none  focus:border-teal-500 ${customStyles}`}
    />
  );
}

export default CustomInput;
