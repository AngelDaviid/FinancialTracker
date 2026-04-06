export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (auth: { token: string; user: User }) => void;
  logout: () => void;
}
