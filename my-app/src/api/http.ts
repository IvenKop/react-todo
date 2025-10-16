const BASE = import.meta.env.VITE_API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new Error("API not configured");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const http = { request };
