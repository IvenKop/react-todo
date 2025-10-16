import { createContext, useMemo, useState } from "react";
import type { LoginInput } from "../validation/auth";
import { loginSchema } from "../validation/auth";
import { apiLogin } from "../api/auth";

type AuthCtx = {
  isAuthed: boolean;
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
};
export const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(
    !!localStorage.getItem("auth_token"),
  );

  async function login(input: LoginInput) {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message ?? "Invalid email or password";
      throw new Error(msg);
    }

    const { token } = await apiLogin(parsed.data.email, parsed.data.password);
    localStorage.setItem("auth_token", token);
    setIsAuthed(true);
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setIsAuthed(false);
  }

  const value = useMemo(() => ({ isAuthed, login, logout }), [isAuthed]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
