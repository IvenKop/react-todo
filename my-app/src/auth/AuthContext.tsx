import { createContext, useMemo, useState } from "react";
import type { LoginInput } from "../validation/auth";
import { loginSchema } from "../validation/auth";
import { apiLogin, apiRegister } from "../api/auth";

type AuthCtx = {
  isAuthed: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: LoginInput) => Promise<void>;
  logout: () => void;
};
export const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(
    !!localStorage.getItem("auth_token"),
  );

  async function persistTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    setIsAuthed(true);
  }

  async function login(input: LoginInput) {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message ?? "Invalid email or password";
      throw new Error(msg);
    }
    const { accessToken, refreshToken } = await apiLogin(
      parsed.data.email,
      parsed.data.password,
    );
    await persistTokens(accessToken, refreshToken);
  }

  async function register(input: LoginInput) {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message ?? "Invalid registration data";
      throw new Error(msg);
    }
    const { accessToken, refreshToken } = await apiRegister(
      parsed.data.email,
      parsed.data.password,
    );
    await persistTokens(accessToken, refreshToken);
  }

  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthed(false);
  }

  const value = useMemo(
    () => ({ isAuthed, login, register, logout }),
    [isAuthed],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
