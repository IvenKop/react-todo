import { createContext, useContext, useMemo, useState } from "react";

type AuthContextType = {
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void> | void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(AUTH_KEY));
  });

  const login = (email: string, password: string) => {
    if (!email || !password) return;
    localStorage.setItem(AUTH_KEY, "mock-token");
    setIsAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
  };

  const value = useMemo(() => ({ isAuthed, login, logout }), [isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
