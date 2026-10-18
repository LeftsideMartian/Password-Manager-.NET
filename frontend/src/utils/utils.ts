import type { User } from "./types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function storeAuthSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const userString = localStorage.getItem(USER_KEY);

  if (!userString) return null;

  try {
    return JSON.parse(userString) as User;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
