import { useState } from "react";
import { Icon, type IconName } from "../components/Icon";
import { Generator } from "./Generator";
import { LoginScreen } from "./LoginScreen";
import { Overview } from "./Overview";
import { Settings } from "./Settings";
import { Vault } from "./Vault";
import type { View } from "./types";
import "../App.css";

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [view, setView] = useState<View>("overview");
  const [mobileNav, setMobileNav] = useState(false);

  if (!userEmail) return <LoginScreen onLogin={setUserEmail} />;

  const firstName = userEmail.split("@")[0].split(/[._-]/)[0];

  function signOut() {
    localStorage.removeItem("token");
    setUserEmail(null);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><Icon name="shield" size={20} /></span>
          <span>NetPass</span>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <NavButton active={view === "overview"} icon="grid" label="Overview" onClick={() => { setView("overview"); setMobileNav(false); }} />
          <NavButton active={view === "vault"} icon="key" label="My vault" badge="12" onClick={() => { setView("vault"); setMobileNav(false); }} />
          <NavButton active={view === "generator"} icon="sparkles" label="Password generator" onClick={() => { setView("generator"); setMobileNav(false); }} />
          <p className="nav-label nav-label-spaced">Manage</p>
          <NavButton active={view === "settings"} icon="settings" label="Settings" onClick={() => { setView("settings"); setMobileNav(false); }} />
        </nav>
        <div className="sidebar-bottom">
          <div className="security-card">
            <span className="security-icon"><Icon name="shield" size={17} /></span>
            <div><strong>You're protected</strong><span>Vault health is excellent</span></div>
          </div>
          <button className="profile-button" onClick={() => setView("settings")}>
            <span className="avatar">{firstName.slice(0, 2).toUpperCase()}</span>
            <span className="profile-copy"><strong>{userEmail}</strong><small>Personal account</small></span>
            <Icon name="chevron" size={16} />
          </button>
          <button className="logout-button" onClick={signOut}><Icon name="logout" size={17} /> Sign out</button>
        </div>
      </aside>
      {mobileNav && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Icon name="menu" /></button>
          <div className="breadcrumb">
            <span>Workspace</span><Icon name="chevron" size={14} />
            <strong>{view === "overview" ? "Overview" : view === "vault" ? "My vault" : view === "generator" ? "Password generator" : "Settings"}</strong>
          </div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Search"><Icon name="search" /></button><button className="help-button">Need help?</button></div>
        </header>
        <div className="page-content">
          {view === "overview" && <Overview firstName={firstName} setView={setView} />}
          {view === "vault" && <Vault />}
          {view === "generator" && <Generator />}
          {view === "settings" && <Settings email={userEmail} />}
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, icon, label, badge, onClick }: {
  active: boolean;
  icon: IconName;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>
      <Icon name={icon} size={18} /><span>{label}</span>{badge && <small>{badge}</small>}
    </button>
  );
}

export default App;
