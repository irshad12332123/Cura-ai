import { useState } from "react";
import { API_BASE_URL } from "../api/baseurl";
export default function useChatHistory(userId: any, token: any) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await fetch(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHistory(data.messages || []);
  };

  const clearHistory = async () => {
    await fetch(`${API_BASE_URL}/api/history/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory([]);
  };

  return { history, fetchHistory, clearHistory };
}
