import { createContext, useMemo, useState, type ReactNode } from "react";
import { loginSchema } from "../validation/auth";

type AuthContextType = {
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void> | void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "auth_token";
// const DEMO = { email: "demo@example.com", password: "1234" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() =>
    Boolean(localStorage.getItem(AUTH_KEY)),
  );

  const login = (email: string, password: string) => {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) throw parsed.error;

    // const { email: e, password: p } = parsed.data;
    // if (e !== DEMO.email || p !== DEMO.password) {
    //   throw new Error("WRONG_EMAIL_OR_PASSWORD");
    // }

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
