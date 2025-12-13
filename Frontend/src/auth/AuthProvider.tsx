import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginRequest, registerRequest, decodeUser } from "./auth.service";
import { authStorage } from "./auth.storage";
import type { User } from "../../types/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();
    if (token && storedUser) {
      setAccessToken(token);
      setUser(storedUser);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginRequest(username, password);
      const user = decodeUser(data.accessToken);

      setUser(user);
      setAccessToken(data.accessToken);
      authStorage.setToken(data.accessToken);
      authStorage.setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    try {
      await registerRequest(username, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    authStorage.clearToken();
    authStorage.clearUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
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
