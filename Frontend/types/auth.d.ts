export interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
