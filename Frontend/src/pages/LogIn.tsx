import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import CustomInput from "../components/features/bot/CustomInput";
import CustomButtton from "../components/ui/CustomButtton";
import Loader from "../components/ui/Loader";

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
      <div className="h-screen w-full flex justify-center items-center">
        <Loader variant="bar" />
      </div>
    );

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#081208] px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md 
          bg-[#0f1a0f] 
          shadow-lg border border-[#1e2b1e]
          rounded-3xl p-8 flex flex-col gap-6
        "
      >
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-white">
          Welcome Back
        </h1>
        <p className="text-center text-gray-300 text-sm -mt-4">
          Please enter your details to sign in.
        </p>

        {/* INPUTS */}
        <div className="flex flex-col gap-4 mt-2">
          <CustomInput
            placeholder="Enter your username"
            value={name}
            inputType="text"
            setValue={setName}
            customStyles="w-full py-3 px-4 rounded-xl bg-[#111c11] border border-[#1e2b1e] text-white"
          />

          <CustomInput
            placeholder="Enter your password"
            value={password}
            inputType="password"
            setValue={setPassword}
            customStyles="w-full py-3 px-4 rounded-xl bg-[#111c11] border border-[#1e2b1e] text-white"
          />
        </div>

        {/* Login Button */}
        <div className="w-full mt-2">
          <CustomButtton value="Login" type="secondary" btnType="submit" />
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link to={"/register"} className="text-green-400 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LogIn;
