import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import CustomInput from "../components/CustomInput";
import CustomButtton from "../components/CustomButtton";
import Loader from "../components/Loader";

function LogIn() {
  const { login, loading, accessToken } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && accessToken) {
      navigate("/", { replace: true });
    }
  }, [loading, accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(name, password);
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  if (loading)
    return (
      <div className="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 h-screen w-screen flex justify-center items-center">
        <Loader variant="bar" />
      </div>
    );

  return (
    <main className="flex bg-[#0b0219] h-screen w-screen justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] md:w-120 h-150 border-1 border-[rgba(153,140,175,0.35)] shadow-[0_0_10px_rgba(153,140,175,0.35)] flex flex-col p-5 rounded-4xl items-center justify-between"
      >
        <p className="text-2xl pb-5 w-full text-white text-center border-b-1 border-[rgba(153,140,175,0.19)]">
          Stay Local 🔐
        </p>
        <div className="w-[70%] flex flex-col gap-5">
          <CustomInput
            placeholder="enter name"
            value={name}
            inputType="text"
            setValue={setName}
          />
          <CustomInput
            placeholder="enter password"
            value={password}
            inputType="password"
            setValue={setPassword}
          />
        </div>
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          <CustomButtton value="Log In" type="secondary" btnType="submit" />
        </div>
      </form>
    </main>
  );
}

export default LogIn;
