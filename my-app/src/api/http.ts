const BASE = import.meta.env.VITE_API_URL;

function getAccessToken() {
  return localStorage.getItem("auth_token") || localStorage.getItem("access_token") || "";
}

function setAccessToken(token: string) {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("access_token", token);
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token") || "";
}

function setRefreshToken(token: string) {
  localStorage.setItem("refresh_token", token);
}

async function refreshTokens(): Promise<boolean> {
  if (!BASE) return false;
  const rt = getRefreshToken();
  if (!rt) return false;
  const res = await fetch(`${BASE}/api/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => null);
  const at = data?.accessToken;
  const rt2 = data?.refreshToken;
  if (!at || !rt2) return false;
  setAccessToken(at);
  setRefreshToken(rt2);
  return true;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) {
    throw new Error("API URL is not configured");
  }

  const withAuth = () => {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (init?.headers) {
      const h = new Headers(init.headers as HeadersInit);
      h.forEach((v, k) => (headers[k] = v));
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const doFetch = async (): Promise<Response> => {
    return fetch(`${BASE}${path}`, {
      ...init,
      headers: withAuth(),
    });
  };

  let res = await doFetch();

  if (res.status === 401) {
    let code = "";
    try {
      const txt = await res.text();
      code = JSON.parse(txt)?.error || txt || "";
    } catch {
      code = "UNAUTHORIZED";
    }
    if (code === "TOKEN_EXPIRED" || code === "UNAUTHORIZED" || code === "MISSING_TOKEN") {
      const ok = await refreshTokens();
      if (ok) {
        res = await doFetch();
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") {
          if (window.location.hash !== "#/login") {
            window.location.hash = "#/login";
          }
        }
        throw new Error(code || "UNAUTHORIZED");
      }
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!res.ok) {
    try {
      const { error } = JSON.parse(text);
      throw new Error(error || res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const http = { request, setAccessToken, setRefreshToken };
