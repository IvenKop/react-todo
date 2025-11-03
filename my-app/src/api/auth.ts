import { http } from "./http";

export type AuthResponse = {
  token?: string;
  accessToken: string;
  refreshToken?: string;
  user: { id: string; email: string };
};

export async function apiLogin(email: string, password: string) {
  return http.request<AuthResponse>("/api/login", {
    method: "POST",
    body: { email, password }
  });
}

export async function apiRegister(email: string, password: string) {
  return http.request<AuthResponse>("/api/register", {
    method: "POST",
    body: { email, password }
  });
}
