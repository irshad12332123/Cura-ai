import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../../types/auth";
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = "http://localhost:3000";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const getLocalStorageItem = (item: string) => {
    return localStorage.getItem(`${item}`);
}

    const removeLocalStorageItem = (item: string) => {
    localStorage.removeItem(`${item}`);
}

    useEffect(() => {
    const storedToken = getLocalStorageItem("accessToken");
    const storedUser = getLocalStorageItem("userDetails");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing userDetails from localStorage:", error);
        localStorage.removeItem("userDetails");
      }
    }
  }, []);

  const decodeUser = (token: string): User => {
    const decoded: any = jwtDecode(token);
    console.log(decoded, "ACCESSTOKEN", accessToken);
    return { id: decoded.id, userName: decoded.username };
  };

const login = async (username: string, password: string): Promise<void> => {
  try {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const analystData = await response.json();

    if (!response.ok) {
      setUser(null);
      setAccessToken(null);
      throw new Error(analystData.message);
    }

    const decodedUser = decodeUser(analystData.accessToken);

    setAccessToken(analystData.accessToken);
    setUser(decodedUser);

    localStorage.setItem("accessToken", analystData.accessToken);
    localStorage.setItem("userDetails", JSON.stringify(decodedUser));

  } catch (error) {
    setUser(null);
    setAccessToken(null);
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    try {
      setLoading(true);
      removeLocalStorageItem("accessToken");
      setAccessToken(null);
      setUser(null);  
      removeLocalStorageItem("userDetails");
    } catch (error) {
      if(error instanceof Error) {
        throw new Error(`Error occured: ${error.message}`);
      }
    }finally{
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};