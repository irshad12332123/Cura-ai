import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import CustomInput from "../components/features/bot/CustomInput";
import CustomButtton from "../components/ui/CustomButtton";
import Loader from "../components/ui/Loader";

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

    if (password !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
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
          Create Account
        </h1>
        <p className="text-center text-gray-300 text-sm -mt-4">
          Join us and begin your experience.
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mt-2">
          <CustomInput
            placeholder="Enter username"
            value={name}
            inputType="text"
            setValue={setName}
            customStyles="w-full py-3 px-4 rounded-xl bg-[#111c11] border border-[#1e2b1e] text-white"
          />

          <CustomInput
            placeholder="Enter password"
            value={password}
            inputType="password"
            setValue={setPassword}
            customStyles="w-full py-3 px-4 rounded-xl bg-[#111c11] border border-[#1e2b1e] text-white"
          />

          <CustomInput
            placeholder="Confirm password"
            value={confirmPassword}
            inputType="password"
            setValue={setConfirmPassword}
            customStyles="w-full py-3 px-4 rounded-xl bg-[#111c11] border border-[#1e2b1e] text-white"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-center text-red-400 text-sm">{error}</p>}

        {/* Register Button */}
        <CustomButtton value="Register" type="secondary" btnType="submit" />

        {/* Link */}
        <p className="text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
