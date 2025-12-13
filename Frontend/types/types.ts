// types.ts
export type Message = { message: string; messageFrom: "User" | "Bot" };

export type ContextChatMessage = {
  role: "user" | "assistant";
  content: string;
};
