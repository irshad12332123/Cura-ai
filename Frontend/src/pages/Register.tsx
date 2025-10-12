import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import CustomInput from "../components/CustomInput";
import CustomButtton from "../components/CustomButtton";
import Loader from "../components/Loader";

function Register() {
  const { register, loading, accessToken } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (!loading && accessToken) {
      navigate("/", { replace: true });
    }
  }, [loading, accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {
      if (confirmPassword !== password) return setError("Please enter details")
      await register(name, password);
      navigate("/login");
    } catch (e) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("An unknown error occurred");
  }
}
  };

  if (loading)
    return (
      <div className="0 h-screen w-full flex justify-center items-center">
        <Loader variant="bar" />
      </div>
    );

  return (
    <main className="flex bg-gradient-to-bl from-[#000000] via-[#07131b]  to-[#04000b] h-screen w-screen justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] md:w-120 h-150 border-1 border-[rgba(153,140,175,0.35)] shadow-[0_0_10px_rgba(153,140,175,0.35)] flex flex-col p-5 rounded-4xl items-center justify-between"
      >
        <p className="text-2xl pb-5 w-full text-white text-center border-b-1 border-[rgba(153,140,175,0.19)]">
          Stay Local 🔐
        </p>
        <div className="w-[70%] flex flex-col gap-5">
          <CustomInput
            placeholder="Name"
            value={name}
            inputType="text"
            setValue={setName}
            customStyles={"border border-[#3C324D] py-4 rounded-xl px-3 text-white"}
          />
          <CustomInput
            placeholder="Password"
            value={password}
            inputType="password"
            setValue={setPassword}
            customStyles={"border border-[#3C324D] py-4 rounded-xl px-3 text-white"}
          />
            <CustomInput
            placeholder="confirm password"
            value={confirmPassword}
            inputType="password"
            setValue={setConfirmPassword}
            customStyles={"border border-[#3C324D] py-4 rounded-xl px-3 text-white"}
          />
        </div>
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          { error && <p className="text-red-400">{error}</p>}
          <p className="text-white">Already have account? <Link to={"/login"} className="text-teal-500">Login Here! </Link></p>
          <CustomButtton  value="Register" type="secondary" btnType="submit" />
        </div>
      </form>
    </main>
  );
}

export default Register;
