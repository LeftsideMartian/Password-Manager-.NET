import type { AuthSession, User } from "./types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

// localStorage can throw in some embedded or private browsers (for example
// when storage is blocked), and saved values can be corrupted. These helpers
// never throw, so a storage problem logs the user out instead of crashing the app.
function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the session just won't survive a page reload.
  }
}

function readJson<T>(key: string): T | null {
  const text = readItem(key);
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function storeAuthSession(token: AuthSession, user: User) {
  writeItem(TOKEN_KEY, JSON.stringify(token));
  writeItem(USER_KEY, JSON.stringify(user));
}

export function getAuthSession(): AuthSession | null {
  return readJson<AuthSession>(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  return readJson<User>(USER_KEY);
}

export function storeUser(user: User) {
  writeItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
