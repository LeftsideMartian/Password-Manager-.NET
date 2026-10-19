import { getAuthSession } from "../utils/utils";

const API_URL = "http://localhost:5126";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const authSession = getAuthSession();
  const headers = new Headers(options.headers);

  if (options.body) headers.set("Content-Type", "application/json");
  if (authSession) headers.set("Authorization", `Bearer ${authSession.token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) throw new Error(`Request failed (${response.status})`);

  if (response.status === 204) return undefined as T;

  const responseBody = await response.text();

  return responseBody ? (JSON.parse(responseBody) as T) : (undefined as T);
}

export function apiGet<T>(path: string) {
  return apiFetch<T>(path, { method: "GET" });
}

export function apiPost<TRequest, TResponse>(path: string, body: TRequest) {
  return apiFetch<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPut<TRequest, TResponse>(path: string, body: TRequest) {
  return apiFetch<TResponse>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete<TResponse = void>(path: string) {
  return apiFetch<TResponse>(path, { method: "DELETE" });
}
