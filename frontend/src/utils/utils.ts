import type { AuthSession, User } from "./types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function storeAuthSession(token: AuthSession, user: User) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthSession(): AuthSession | null {
  const tokenString = localStorage.getItem(TOKEN_KEY);

  return tokenString !== null
    ? (JSON.parse(tokenString) satisfies AuthSession)
    : null;
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
