import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession, LoginResponse, User } from "../utils/types";
import {
  clearAuthSession,
  getAuthSession,
  getStoredUser,
  storeAuthSession,
  storeUser,
} from "../utils/utils";

function getValidStoredSession(): AuthSession | null {
  const session = getAuthSession();

  if (!session || session.expiresAt <= Date.now()) {
    clearAuthSession();
    return null;
  }

  return session;
}

type UserContextValue = {
  user: User | null;
  authSession: AuthSession | null;
  signIn: (response: LoginResponse) => void;
  updateUser: (user: User) => void;
  signOut: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() =>
    getValidStoredSession(),
  );

  const [user, setUser] = useState<User | null>(() =>
    authSession ? getStoredUser() : null,
  );

  function signIn(response: LoginResponse) {
    const authSession: AuthSession = {
      token: response.token,
      expiresAt: Date.now() + response.expiresIn * 1000,
    };

    storeAuthSession(authSession, response.user);
    setAuthSession(authSession);
    setUser(response.user);
  }

  function signOut() {
    clearAuthSession();
    setAuthSession(null);
    setUser(null);
  }

  function updateUser(nextUser: User) {
    storeUser(nextUser);
    setUser(nextUser);
  }

  useEffect(() => {
    if (!authSession) return;

    const remainingTime = authSession.expiresAt - Date.now();

    if (remainingTime <= 0) {
      signOut();
      return;
    }

    const timeout = window.setTimeout(signOut, remainingTime);

    // Cleanup above timeout when UserProvider stops rendering
    return () => window.clearTimeout(timeout);
  }, [authSession]);

  return (
    <UserContext.Provider
      value={{ user, authSession, signIn, updateUser, signOut }}
    >
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
