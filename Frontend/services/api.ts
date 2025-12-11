const API_BASE_URL = "https://cura-ai-tq9s.onrender.com";

export const register = async (name: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) return { error: data.message };

    return data;
  } catch (error) {}
};

export const login = async (name: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) return { error: result.message };
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new ErrorEvent(error.message);
    }
  }
};
