const BASE = import.meta.env.VITE_API_URL as string | undefined;

function getAccessToken() {
  return (
    localStorage.getItem("auth_token") ||
    localStorage.getItem("access_token") ||
    ""
  );
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

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  skipAuth?: boolean;
  baseUrlOverride?: string;
};

async function doFetch<T>(
  url: string,
  options: RequestOptions,
  attempt: number
): Promise<T> {
  const headers = new Headers(options.headers || {});
  const isJsonBody =
    options.body && typeof options.body === "object" && !(options.body instanceof FormData);

  if (isJsonBody) {
    headers.set("Content-Type", "application/json");
  }
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: isJsonBody ? JSON.stringify(options.body as object) : (options.body as BodyInit | null)
  });

  const text = await res.text();

  if (res.status === 401 && !options.skipAuth && attempt === 0 && BASE) {
    const rt = getRefreshToken();
    if (rt) {
      const r = await fetch(`${BASE}/api/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt })
      });
      if (r.ok) {
        const data = (await r.json()) as {
          accessToken?: string;
          refreshToken?: string;
        };
        if (data.accessToken) setAccessToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        return doFetch<T>(url, options, 1);
      }
    }
  }

  if (!res.ok) {
    try {
      const parsed = text ? JSON.parse(text) : {};
      const msg =
        (parsed && (parsed.error || parsed.message)) || res.statusText || "Request failed";
      throw new Error(msg);
    } catch {
      throw new Error(text || res.statusText || "Request failed");
    }
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = options.baseUrlOverride ?? BASE;
  if (!base) {
    throw new Error("API URL is not configured");
  }
  const url = path.startsWith("http") ? path : `${base}${path}`;
  return doFetch<T>(url, options, 0);
}

export const http = {
  request,
  setAccessToken,
  setRefreshToken
};
