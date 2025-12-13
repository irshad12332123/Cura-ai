import type { User } from "../../types/auth";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (u: User) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  clearUser: () => localStorage.removeItem(USER_KEY),
};
