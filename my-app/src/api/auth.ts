const BASE = import.meta.env.VITE_API_URL;

export type AuthResponse = {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string };
};

export async function apiLogin(email: string, password: string) {
  if (!BASE) throw new Error("API URL is not configured");
  const res = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error || "WRONG_EMAIL_OR_PASSWORD");
  }
  return res.json() as Promise<AuthResponse>;
}

export async function apiRegister(email: string, password: string) {
  if (!BASE) throw new Error("API URL is not configured");
  const res = await fetch(`${BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error || "REGISTER_FAILED");
  }
  return res.json() as Promise<AuthResponse>;
}
