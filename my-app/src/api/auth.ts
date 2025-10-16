export async function apiLogin(email: string, password: string) {
  if (!import.meta.env.VITE_API_URL) {
    return { token: "mock-token-local", user: { id: "local", email } };
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      const { error } = JSON.parse(text);
      throw new Error(error || res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }
  return JSON.parse(text) as { token: string; user: { id: string; email: string } };
}