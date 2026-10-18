import { createContext, useContext, useState, type ReactNode } from "react";
import type { LoginResponse, User } from "../utils/types";
import {
  clearAuthSession,
  getAuthToken,
  getStoredUser,
  storeAuthSession,
} from "../utils/utils";

type UserContextValue = {
  user: User | null;
  token: string | null;
  signIn: (response: LoginResponse) => void;
  signOut: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    getAuthToken() ? getStoredUser() : null,
  );
  const [token, setToken] = useState<string | null>(() => getAuthToken());

  function signIn(response: LoginResponse) {
    storeAuthSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }

  function signOut() {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
