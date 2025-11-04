import { createContext, useMemo, useState } from "react";
import type { LoginInput } from "../validation/auth";
import { loginSchema } from "../validation/auth";
import { apiLogin, apiRegister } from "../api/auth";
import { http } from "../api/http";
import { useMutation } from "@tanstack/react-query";

type AuthCtx = {
  isAuthed: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: LoginInput) => Promise<void>;
  logout: () => void;
};
export const AuthContext = createContext<AuthCtx | null>(null);

async function persistTokens(access?: string, refresh?: string) {
  if (access) {
    http.setAccessToken(access);
    localStorage.setItem("auth_token", access);
  }
  if (refresh) {
    http.setRefreshToken(refresh);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(
    !!localStorage.getItem("auth_token"),
  );

  const loginMut = useMutation({
    mutationFn: async (payload: LoginInput) => {
      const parsed = loginSchema.safeParse(payload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Validation error";
        throw new Error(msg);
      }
      return apiLogin(parsed.data.email, parsed.data.password);
    },
    onSuccess: async (res) => {
      await persistTokens(res.accessToken, res.refreshToken);
      setIsAuthed(true);
    },
  });

  const registerMut = useMutation({
    mutationFn: async (payload: LoginInput) => {
      const parsed = loginSchema.safeParse(payload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Validation error";
        throw new Error(msg);
      }
      return apiRegister(parsed.data.email, parsed.data.password);
    },
    onSuccess: async (res) => {
      await persistTokens(res.accessToken, res.refreshToken);
      setIsAuthed(true);
    },
  });

  async function login(data: LoginInput) {
    await loginMut.mutateAsync(data);
  }

  async function register(data: LoginInput) {
    await registerMut.mutateAsync(data);
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
