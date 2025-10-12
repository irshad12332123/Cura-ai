import { Navigate } from "react-router-dom";
import { useAuth } from "./authProvider";
import Loader from "../components/Loader";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const { loading, accessToken } = useAuth();

  if (loading)
    return (
      <div className="bg-[#0b0219] h-screen w-screen flex justify-center items-center">
        <Loader variant="bar" />
      </div>
    );

  if (!loading && !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
