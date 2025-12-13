import type { ContextChatMessage } from "../../../types/types";
import { API_BASE_URL } from "../../api/baseurl";

// generating response
export const generateResponse = async (
  token: string,
  input: string,
  contextForBackend: ContextChatMessage[],
  userId: String
) => {
  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: input,
      context: contextForBackend,
      userId,
    }),
  });

  return res;
};

// adding user message to DB
export const addUserMessage = async (token: string, input: string) => {
  await fetch(`${API_BASE_URL}/api/history/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: input, sender: "User" }),
  });
};

export const addBotReply = async (token: string, replyText: string) => {
  await fetch(`${API_BASE_URL}/api/history/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: replyText, sender: "Bot" }),
  });
};
