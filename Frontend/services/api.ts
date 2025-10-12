export const API_BASE_URL = "http://localhost:3000";

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const analystData = await response.json();

    if (!response.ok) return { error: analystData.message };
    
    return analystData;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};
