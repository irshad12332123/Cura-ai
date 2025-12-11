import { useState, useEffect } from "react";

export default function useChatHistory(userId: any, token: any) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await fetch(`http://localhost:3000/api/history/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHistory(data.messages || []);
  };

  const clearHistory = async () => {
    await fetch(`http://localhost:3000/api/history/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory([]);
  };

  return { history, fetchHistory, clearHistory };
}
