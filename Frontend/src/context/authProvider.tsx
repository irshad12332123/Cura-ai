import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthContextType, User } from "../../types/auth";

const API_BASE_URL = "http://localhost:3000";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ---------------------------
  // Load user from localStorage
  // ---------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid stored user JSON");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ---------------------------
  // Decode JWT -> User
  // ---------------------------
  const decodeUser = (token: string): User | null => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id,
        username: decoded.username,
      };
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  // ---------------------------
  // REGISTER USER
  // ---------------------------
  const register = async (
    username: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Registration successful. Please log in.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // LOGIN USER
  // ---------------------------
  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const decodedUser = decodeUser(data.accessToken);
      if (!decodedUser) throw new Error("Token decode failed");

      setUser(decodedUser);
      setAccessToken(data.accessToken);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(decodedUser));
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // ---------------------------
  // Convenience flag
  // ---------------------------
  const isAuthenticated = Boolean(accessToken && user);

  return (
    <AuthContext.Provider
      value={{
        user, // { id, username }
        accessToken, // string
        isAuthenticated, // boolean
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
