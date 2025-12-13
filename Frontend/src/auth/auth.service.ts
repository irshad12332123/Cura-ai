import { jwtDecode } from "jwt-decode";
import type { User } from "../../types/auth";
import { API_BASE_URL } from "../api/baseurl";

export const decodeUser = (token: string): User => {
  const decoded: any = jwtDecode(token);
  return { id: decoded.id, username: decoded.username };
};

export const loginRequest = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const registerRequest = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
