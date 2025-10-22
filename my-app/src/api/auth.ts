export async function apiLogin(email: string, password: string) {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error("API URL is not configured");
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error || "WRONG_EMAIL_OR_PASSWORD");
  }

  return res.json() as Promise<{ token: string; user: { id: string; email: string } }>;
}