import { useEffect, useState } from "react";
import { Icon } from "./components/Icon";
import { Generator } from "./features/Generator";
import { LoginScreen } from "./features/LoginScreen";
import { Overview } from "./features/Overview";
import { Settings } from "./features/Settings";
import { Vault } from "./features/Vault";
import type { IconName } from "./components/Icon";
import type { View } from "./utils/types";
import "./App.css";
import { NavButton } from "./components/NavButton";
import { useUser } from "./context/UserContext";
import { getCredentials } from "./api/credentials";

type NavItem = {
  view: View;
  icon: IconName;
  label: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { view: "overview", icon: "grid", label: "Overview" },
  {
    view: "vault",
    icon: "key",
    label: "My vault",
  },
  {
    view: "generator",
    icon: "sparkles",
    label: "Password generator",
  },
];

function App() {
  const { user, signOut } = useUser();
  const [view, setView] = useState<View>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  // Number of credentials in the vault, shown as the badge on "My vault".
  // null until it has been loaded, so no badge shows while loading.
  const [credentialCount, setCredentialCount] = useState<number | null>(null);

  // Load the count whenever a user logs in.
  useEffect(() => {
    if (!user) {
      setCredentialCount(null);
      return;
    }
    getCredentials()
      .then((credentials) => setCredentialCount(credentials.length))
      .catch(() => setCredentialCount(null));
  }, [user]);

  if (!user) return <LoginScreen />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Icon name="shield" size={20} />
          </span>
          <span>NetPass</span>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ view: navView, ...buttonProps }) => (
            <NavButton
              key={navView}
              {...buttonProps}
              badge={
                navView === "vault" && credentialCount !== null
                  ? String(credentialCount)
                  : undefined
              }
              active={view === navView}
              onClick={() => {
                setView(navView);
                setMobileNav(false);
              }}
            />
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <span className="security-icon">
              <Icon name="shield" size={17} />
            </span>
            <div>
              <strong>You're protected</strong>
              <span>Vault health is excellent</span>
            </div>
          </div>
          <button
            className="profile-button"
            onClick={() => setView("settings")}
          >
            <span className="avatar">
              {user.firstName.slice(0, 2).toUpperCase()}
            </span>
            <span className="profile-copy">
              <strong>{user.email}</strong>
              <small>Personal account</small>
            </span>
            <Icon name="chevron" size={16} />
          </button>
          <button className="logout-button" onClick={signOut}>
            <Icon name="logout" size={17} /> Sign out
          </button>
        </div>
      </aside>

      {mobileNav && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}

      <main className="main-content">
        <div className="page-content">
          {view === "overview" && <Overview setView={setView} onCountChange={setCredentialCount} />}
          {view === "vault" && <Vault onCountChange={setCredentialCount} />}
          {view === "generator" && <Generator />}
          {view === "settings" && <Settings />}
        </div>
      </main>
    </div>
  );
}

export default App;
