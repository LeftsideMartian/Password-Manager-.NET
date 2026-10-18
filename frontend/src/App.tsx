import { useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
  createCredential,
  generatePassword,
  getCredentials,
  login,
} from "./api";
import type { Credential as ApiCredential } from "./api";
import "./App.css";

type VaultCredential = ApiCredential & {
  title: string;
  color: string;
  initials: string;
};
function toVaultCredential(credential: ApiCredential): VaultCredential {
  const initials = credential.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return {
    ...credential,
    title: credential.name,
    initials,
    color: "orange",
  };
}

type View = "overview" | "vault" | "generator" | "settings";

type IconName =
  | "arrow"
  | "chevron"
  | "copy"
  | "eye"
  | "grid"
  | "key"
  | "lock"
  | "logout"
  | "menu"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "sparkles"
  | "user"
  | "x";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, string> = {
    arrow: "M5 12h14M13 6l6 6-6 6",
    chevron: "M9 18l6-6-6-6",
    copy: "M9 9h10v10H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
    eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    key: "M15.5 8.5a4 4 0 1 0-7.8 1.3L3 14.5V18h3v-2h2v-2h2.5l1.2-1.2a4 4 0 0 0 3.8-4.3ZM15 8h.01",
    lock: "M5 10h14v10H5zM8 10V7a4 4 0 0 1 8 0v3M12 14v2",
    logout: "M10 17l5-5-5-5M15 12H3M21 4v16",
    menu: "M4 6h16M4 12h16M4 18h16",
    plus: "M12 5v14M5 12h14",
    search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    settings:
      "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2-1.1L14.2 3h-4.4l-.4 2.7a8 8 0 0 0-2 1.1l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2 1.1l.4 2.7h4.4l.4-2.7a8 8 0 0 0 2-1.1l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z",
    shield: "M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z",
    sparkles:
      "m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3ZM19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z",
    user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    x: "M6 6l12 12M18 6 6 18",
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoginScreen({
  onLogin,
}: {
  onLogin: (email: string, firstName: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(email, password);
      localStorage.setItem("token", session.token);
      localStorage.setItem("userEmail", session.email);
      localStorage.setItem("userFirstName", session.firstName);
      onLogin(session.email, session.firstName);
    } catch {
      setError("We could not sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <section className="auth-card">
        <div className="brand brand-centered">
          <span className="brand-mark">
            <Icon name="shield" size={20} />
          </span>
          <span>NetPass</span>
        </div>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1>
            Your passwords, <em>protected.</em>
          </h1>
          <p className="auth-subtitle">Sign in to access your secure vault.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <div className="label-row">
            <label htmlFor="password">Master password</label>
            <button type="button" className="text-button">
              Forgot password?
            </button>
          </div>
          <div className="input-with-icon">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your master password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="input-action"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon name="eye" size={18} />
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Signing in…"
            ) : (
              <>
                Unlock vault <Icon name="arrow" size={17} />
              </>
            )}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <button type="button" className="text-button">
            Create one
          </button>
        </p>
        {import.meta.env.DEV && (
          <button
            type="button"
            className="preview-button"
            onClick={() => onLogin("demo@example.com", "Demo")}
          >
            Preview the app <Icon name="arrow" size={14} />
          </button>
        )}
        <div className="auth-trust">
          <Icon name="lock" size={14} /> End-to-end encrypted · Your data stays
          yours
        </div>
      </section>
    </main>
  );
}

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem("token") && localStorage.getItem("userEmail")
      ? localStorage.getItem("userEmail")
      : null,
  );
  const [firstName, setFirstName] = useState<string>(() => {
    const storedFirstName = localStorage.getItem("userFirstName");
    if (storedFirstName) return storedFirstName;

    const storedEmail = localStorage.getItem("userEmail") ?? "";
    return storedEmail.split("@")[0].split(/[._-]/)[0];
  });
  const [credentials, setCredentials] = useState<VaultCredential[]>([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState("");
  const [view, setView] = useState<View>("overview");
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    setCredentialsLoading(true);
    setCredentialsError("");
    getCredentials()
      .then((items) => setCredentials(items.map(toVaultCredential)))
      .catch((error) =>
        setCredentialsError(
          error instanceof Error
            ? error.message
            : "Could not load credentials.",
        ),
      )
      .finally(() => setCredentialsLoading(false));
  }, [userEmail]);

  if (!userEmail) {
    return (
      <LoginScreen
        onLogin={(email, name) => {
          setUserEmail(email);
          setFirstName(name);
        }}
      />
    );
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    setUserEmail(null);
  }

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
          <NavButton
            active={view === "overview"}
            icon="grid"
            label="Overview"
            onClick={() => {
              setView("overview");
              setMobileNav(false);
            }}
          />
          <NavButton
            active={view === "vault"}
            icon="key"
            label="My vault"
            // TODO(frontend-backend): Populate this badge with the user's
            // current credential count.
            badge="12"
            onClick={() => {
              setView("vault");
              setMobileNav(false);
            }}
          />
          <NavButton
            active={view === "generator"}
            icon="sparkles"
            label="Password generator"
            onClick={() => {
              setView("generator");
              setMobileNav(false);
            }}
          />
          <p className="nav-label nav-label-spaced">Manage</p>
          <NavButton
            active={view === "settings"}
            icon="settings"
            label="Settings"
            onClick={() => {
              setView("settings");
              setMobileNav(false);
            }}
          />
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
              {firstName.slice(0, 2).toUpperCase()}
            </span>
            <span className="profile-copy">
              <strong>{userEmail}</strong>
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
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <Icon name="chevron" size={14} />
            <strong>
              {view === "overview"
                ? "Overview"
                : view === "vault"
                  ? "My vault"
                  : view === "generator"
                    ? "Password generator"
                    : "Settings"}
            </strong>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Search">
              <Icon name="search" />
            </button>
            <button className="help-button">Need help?</button>
          </div>
        </header>
        <div className="page-content">
          {view === "overview" && (
            <Overview
              firstName={firstName}
              setView={setView}
              credentials={credentials}
              loading={credentialsLoading}
              error={credentialsError}
            />
          )}
          {view === "vault" && (
            <Vault
              credentials={credentials}
              setCredentials={setCredentials}
              loading={credentialsLoading}
              error={credentialsError}
            />
          )}
          {view === "generator" && <Generator />}
          {view === "settings" && <Settings email={userEmail} />}
        </div>
      </main>
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  icon: IconName;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <Icon name={icon} size={18} />
      <span>{label}</span>
      {badge && <small>{badge}</small>}
    </button>
  );
}

function Overview({
  firstName,
  setView,
  credentials,
  loading,
  error,
}: {
  firstName: string;
  setView: (view: View) => void;
  credentials: VaultCredential[];
  loading: boolean;
  error: string;
}) {
  const [selectedCredential, setSelectedCredential] = useState<
    VaultCredential | null
  >(null);

  return (
    <div className="overview">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">
            {new Intl.DateTimeFormat(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date())}
          </p>
          <h1>
            Good evening, <em>{firstName}.</em>
          </h1>
          <p className="page-subtitle">
            Everything important, safely in one place.
          </p>
        </div>
        <button className="primary-button" onClick={() => setView("generator")}>
          <Icon name="plus" size={18} /> Add password
        </button>
      </section>
      <section className="stats-grid">
        <Stat
          icon="key"
          label="Saved passwords"
          value={loading ? "…" : String(credentials.length)}
          trend="Stored securely"
        />
        <Stat
          icon="shield"
          label="Vault health"
          value="Excellent"
          trend="No issues found"
          tone="green"
        />
        <Stat
          icon="lock"
          label="Last security check"
          value="Today"
          trend="All clear"
          tone="purple"
        />
      </section>
      <div className="section-heading">
        <div>
          <h2>Quick actions</h2>
          <p>Common tasks, one click away.</p>
        </div>
      </div>
      <section className="quick-grid">
        <button
          className="quick-card accent-card"
          onClick={() => setView("generator")}
        >
          <span className="quick-icon">
            <Icon name="sparkles" size={22} />
          </span>
          <span>
            <strong>Generate a password</strong>
            <small>Create a strong, unique password</small>
          </span>
          <Icon name="arrow" size={18} />
        </button>
        <button className="quick-card" onClick={() => setView("vault")}>
          <span className="quick-icon blue">
            <Icon name="key" size={22} />
          </span>
          <span>
            <strong>Browse your vault</strong>
            <small>View and manage saved logins</small>
          </span>
          <Icon name="arrow" size={18} />
        </button>
      </section>
      <section className="recent-section">
        <div className="section-heading">
          <div>
            <h2>Recently added</h2>
            <p>Your latest saved credentials.</p>
          </div>
          <button
            className="text-button with-arrow"
            onClick={() => setView("vault")}
          >
            View all <Icon name="arrow" size={15} />
          </button>
        </div>
        <div className="credential-list">
          {loading && <div className="empty-state">Loading credentials…</div>}
          {error && <div className="empty-state">{error}</div>}
          {!loading && !error && credentials.slice(0, 3).map((item) => (
            <Credential
              item={item}
              key={item.credentialId}
              onOpen={() => setSelectedCredential(item)}
            />
          ))}
          {!loading && !error && credentials.length === 0 && (
            <div className="empty-state">No credentials saved yet.</div>
          )}
        </div>
      </section>
      {selectedCredential && (
        <ViewCredentialOverlay
          item={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onDeleted={() => setSelectedCredential(null)}
        />
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  trend,
  tone = "orange",
}: {
  icon: IconName;
  label: string;
  value: string;
  trend: string;
  tone?: string;
}) {
  return (
    <article className="stat-card">
      <span className={`stat-icon ${tone}`}>
        <Icon name={icon} size={19} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small className={tone === "green" ? "positive" : ""}>{trend}</small>
      </div>
    </article>
  );
}

function Credential({
  item,
  onOpen,
}: {
  item: VaultCredential;
  onOpen?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <article
      className={`credential-row ${onOpen ? "credential-row-clickable" : ""}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (onOpen && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <span className={`site-logo ${item.color}`}>{item.initials}</span>
      <div className="credential-copy">
        <strong>{item.title}</strong>
        <span>{item.username}</span>
      </div>
      <span className="category">{item.category}</span>
      <button
        className="row-action"
        aria-label={`Copy ${item.title} password`}
        onClick={(event) => {
          event.stopPropagation();
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : <Icon name="copy" size={17} />}
      </button>
      <button
        className="row-chevron"
        aria-label={`Open ${item.title}`}
        onClick={(event) => {
          event.stopPropagation();
          onOpen?.();
        }}
      >
        <Icon name="chevron" size={17} />
      </button>
    </article>
  );
}

function Vault({
  credentials,
  setCredentials,
  loading,
  error,
}: {
  credentials: VaultCredential[];
  setCredentials: Dispatch<SetStateAction<VaultCredential[]>>;
  loading: boolean;
  error: string;
}) {
  const [search, setSearch] = useState("");
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [category, setCategory] = useState("All");
  const [selectedCredential, setSelectedCredential] = useState<
    VaultCredential | null
  >(null);
  const filtered = credentials.filter((item) =>
    (category === "All" || item.category === category) &&
    `${item.title} ${item.username} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const categories = ["All", ...new Set(credentials.map((item) => item.category))];

  return (
    <div className="vault-view">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Your secure collection</p>
          <h1>
            My <em>vault.</em>
          </h1>
          <p className="page-subtitle">
            {credentials.length} credentials protected by NetPass.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => setShowAddOverlay(true)}
        >
          <Icon name="plus" size={18} /> Add password
        </button>
      </section>
      <div className="vault-toolbar">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            placeholder="Search your vault"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="filter-button"
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((option) => (
            <option value={option} key={option}>
              {option === "All" ? "All categories" : option}
            </option>
          ))}
        </select>
      </div>
      <div className="vault-list">
        {loading && <div className="empty-state">Loading credentials…</div>}
        {error && <div className="empty-state">{error}</div>}
        {filtered.map((item) => (
          <Credential
            item={item}
            key={item.credentialId}
            onOpen={() => setSelectedCredential(item)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">No credentials match your search.</div>
        )}
      </div>
      {showAddOverlay && (
        <AddCredentialOverlay
        onCreated={(credential) =>
          setCredentials((current) => [toVaultCredential(credential), ...current])
        }
          onClose={() => setShowAddOverlay(false)}
        />
      )}
      {selectedCredential && (
        <ViewCredentialOverlay
          item={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onDeleted={() => {
            // TODO: Delete the credential through the API
            // and remove it from local state only after success.
            setCredentials((current) =>
              current.filter(
                (credential) =>
                  credential.credentialId !== selectedCredential.credentialId,
              ),
            );
            setSelectedCredential(null);
          }}
        />
      )}
    </div>
  );
}

function AddCredentialOverlay({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (credential: ApiCredential) => void;
}) {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("Personal");
  const [showPassword, setShowPassword] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [profile, setProfile] = useState<"Strong" | "EasyToType">("Strong");
  const [length, setLength] = useState(20);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function createPassword() {
    setLoading(true);
    setGenerationError("");
    try {
      const result = await generatePassword(
        localStorage.getItem("token") ?? "",
        profile,
        profile === "Strong" ? length : undefined,
      );
      setPassword(result.password);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Password generation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const credential = await createCredential({
        name: site,
        username,
        password,
        category,
        note,
      });
      onCreated(credential);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save credential.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="overlay-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="add-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-credential-title"
      >
        <header className="overlay-header">
          <div>
            <p className="eyebrow">Securely store a login</p>
            <h2 id="add-credential-title">Add a password</h2>
            <p>Save your credentials so they are always within reach.</p>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close add password dialog"
          >
            <Icon name="x" size={20} />
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="overlay-fields">
            <div className="field-wide">
              <label htmlFor="site">Website or app</label>
              <input
                id="site"
                placeholder="e.g. GitHub, Netflix, AWS"
                value={site}
                onChange={(event) => setSite(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="username">Username or email</label>
              <input
                id="username"
                placeholder="you@example.com"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Development</option>
                <option>Entertainment</option>
                <option>Finance</option>
              </select>
            </div>
            <div className="field-wide">
              <label htmlFor="credential-password">Password</label>
              <div className="overlay-password">
                <input
                  id="credential-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter or generate a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name="eye" size={17} />
                </button>
              </div>
              <button
                type="button"
                className="generator-toggle"
                onClick={() => setShowGenerator(!showGenerator)}
              >
                <Icon name="sparkles" size={15} />{" "}
                {showGenerator
                  ? "Hide generator"
                  : "Generate a strong password"}{" "}
                <Icon name="chevron" size={14} />
              </button>
            </div>
            {showGenerator && (
              <div className="inline-generator field-wide">
                <div className="inline-generator-top">
                  <strong>Password generator</strong>
                  <span>Generation is handled securely by the backend.</span>
                </div>
                <div className="segmented">
                  <button
                    type="button"
                    className={profile === "Strong" ? "selected" : ""}
                    onClick={() => setProfile("Strong")}
                  >
                    Strong
                  </button>
                  <button
                    type="button"
                    className={profile === "EasyToType" ? "selected" : ""}
                    onClick={() => setProfile("EasyToType")}
                  >
                    Easy to type
                  </button>
                </div>
                {profile === "Strong" && (
                  <div className="inline-length">
                    <label htmlFor="overlay-length">
                      Length <strong>{length}</strong>
                    </label>
                    <input
                      id="overlay-length"
                      type="range"
                      min="12"
                      max="40"
                      value={length}
                      onChange={(event) =>
                        setLength(Number(event.target.value))
                      }
                    />
                  </div>
                )}
                <button
                  type="button"
                  className="secondary-button generate-inline"
                  onClick={createPassword}
                  disabled={loading}
                >
                  <Icon name="sparkles" size={15} />{" "}
                  {loading ? "Generating…" : "Generate and use password"}
                </button>
                {generationError && (
                  <p className="generation-error">{generationError}</p>
                )}
              </div>
            )}
            <div className="field-wide">
              <label htmlFor="notes">
                Notes <span className="optional">(optional)</span>
              </label>
              <textarea
                id="notes"
                placeholder="Add a note about this login"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <footer className="overlay-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              <Icon name="lock" size={15} /> Save credential
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function ViewCredentialOverlay({
  item,
  onClose,
  onDeleted,
}: {
  item: VaultCredential;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [site, setSite] = useState(item.title);
  const [username, setUsername] = useState(item.username);
  // TODO(frontend-backend): Load the decrypted credential value only when
  // this detail view is authorised, rather than using a demo password.
  const [password, setPassword] = useState("vR8!kP2#xL9@mN4$wQ7&");
  const [category, setCategory] = useState(item.category);
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [profile, setProfile] = useState<"Strong" | "EasyToType">("Strong");
  const [length, setLength] = useState(20);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  async function createPassword() {
    setLoading(true);
    setGenerationError("");
    try {
      const result = await generatePassword(
        localStorage.getItem("token") ?? "",
        profile,
        profile === "Strong" ? length : undefined,
      );
      setPassword(result.password);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Password generation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    // TODO(frontend-backend): Persist the edited credential before closing
    // the dialog and update the vault list with the saved response.
    onClose();
  }

  async function copyPassword() {
    await navigator.clipboard?.writeText(password);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 1500);
  }

  return (
    <div
      className="overlay-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="add-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-credential-title"
      >
        <header className="overlay-header">
          <div>
            <p className="eyebrow">Credential details</p>
            <h2 id="view-credential-title">Edit {item.title}</h2>
            <p>Update your saved login details securely.</p>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close credential dialog"
          >
            <Icon name="x" size={20} />
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="overlay-fields">
            <div className="field-wide">
              <label htmlFor="view-site">Website or app</label>
              <input
                id="view-site"
                value={site}
                onChange={(event) => setSite(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="view-username">Username or email</label>
              <input
                id="view-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="view-category">Category</label>
              <select
                id="view-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Development</option>
                <option>Entertainment</option>
                <option>Finance</option>
              </select>
            </div>
            <div className="field-wide">
              <label htmlFor="view-password">Password</label>
              <div className="overlay-password">
                <input
                  id="view-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <div className="password-actions">
                  <button
                    type="button"
                    onClick={copyPassword}
                    aria-label="Copy password"
                  >
                    {passwordCopied ? "Copied" : <Icon name="copy" size={17} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <Icon name="eye" size={17} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="generator-toggle"
                onClick={() => setShowGenerator(!showGenerator)}
              >
                <Icon name="sparkles" size={15} />{" "}
                {showGenerator ? "Hide generator" : "Generate a new password"}{" "}
                <Icon name="chevron" size={14} />
              </button>
            </div>
            {showGenerator && (
              <div className="inline-generator field-wide">
                <div className="inline-generator-top">
                  <strong>Password generator</strong>
                  <span>Generation is handled securely by the backend.</span>
                </div>
                <div className="segmented">
                  <button
                    type="button"
                    className={profile === "Strong" ? "selected" : ""}
                    onClick={() => setProfile("Strong")}
                  >
                    Strong
                  </button>
                  <button
                    type="button"
                    className={profile === "EasyToType" ? "selected" : ""}
                    onClick={() => setProfile("EasyToType")}
                  >
                    Easy to type
                  </button>
                </div>
                {profile === "Strong" && (
                  <div className="inline-length">
                    <label htmlFor="view-length">
                      Length <strong>{length}</strong>
                    </label>
                    <input
                      id="view-length"
                      type="range"
                      min="12"
                      max="40"
                      value={length}
                      onChange={(event) =>
                        setLength(Number(event.target.value))
                      }
                    />
                  </div>
                )}
                <button
                  type="button"
                  className="secondary-button generate-inline"
                  onClick={createPassword}
                  disabled={loading}
                >
                  <Icon name="sparkles" size={15} />{" "}
                  {loading ? "Generating…" : "Generate and use password"}
                </button>
                {generationError && (
                  <p className="generation-error">{generationError}</p>
                )}
              </div>
            )}
            <div className="field-wide">
              <label htmlFor="view-notes">
                Notes <span className="optional">(optional)</span>
              </label>
              <textarea
                id="view-notes"
                placeholder="Add a note about this login"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </div>
          <footer className="overlay-footer">
            <button
              type="button"
              className="delete-button"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <Icon name="x" size={15} /> Delete credential
            </button>
            <span className="overlay-footer-spacer" />
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              <Icon name="lock" size={15} /> Save changes
            </button>
          </footer>
        </form>
      </section>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          credentialName={site || item.title}
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={onDeleted}
        />
      )}
    </div>
  );
}

function DeleteConfirmation({
  credentialName,
  onCancel,
  onConfirm,
}: {
  credentialName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="confirmation-backdrop" role="presentation">
      <section
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-credential-title"
      >
        <span className="delete-icon">
          <Icon name="x" size={21} />
        </span>
        <h2 id="delete-credential-title">Delete this credential?</h2>
        <p>
          <strong>{credentialName}</strong> will be permanently removed from
          your vault. This action cannot be undone.
        </p>
        <div className="confirmation-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Keep credential
          </button>
          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Delete permanently
          </button>
        </div>
      </section>
    </div>
  );
}

function Generator() {
  const [profile, setProfile] = useState<"Strong" | "EasyToType">("Strong");
  const [length, setLength] = useState(20);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState("");

  async function createPassword() {
    setLoading(true);
    setGenerationError("");
    try {
      const result = await generatePassword(
        localStorage.getItem("token") ?? "",
        profile,
        profile === "Strong" ? length : undefined,
      );
      setPassword(result.password);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Password generation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="generator-view">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Built for better security</p>
          <h1>
            Password <em>generator.</em>
          </h1>
          <p className="page-subtitle">
            Create a strong password you can trust.
          </p>
        </div>
      </section>
      <div className="generator-layout">
        <section className="generator-card">
          <div className="generator-card-heading">
            <span className="large-icon">
              <Icon name="sparkles" size={24} />
            </span>
            <div>
              <h2>Make a new password</h2>
              <p>Customise it to fit your needs.</p>
            </div>
          </div>
          <div className="password-result">
            <code>
              {password || "Your generated password will appear here"}
            </code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              aria-label="Copy generated password"
              disabled={!password}
            >
              <Icon name="copy" size={19} />
            </button>
          </div>
          {copied && (
            <p className="copied-message">Password copied to clipboard.</p>
          )}
          {generationError && (
            <p className="generation-error">{generationError}</p>
          )}
          <div className="generator-options">
            <div>
              <label>Style</label>
              <div className="segmented">
                <button
                  className={profile === "Strong" ? "selected" : ""}
                  onClick={() => setProfile("Strong")}
                >
                  Strong
                </button>
                <button
                  className={profile === "EasyToType" ? "selected" : ""}
                  onClick={() => setProfile("EasyToType")}
                >
                  Easy to type
                </button>
              </div>
            </div>
            {profile === "Strong" && (
              <div>
                <div className="label-row">
                  <label htmlFor="length">Length</label>
                  <strong>{length} characters</strong>
                </div>
                <input
                  id="length"
                  type="range"
                  min="12"
                  max="40"
                  value={length}
                  onChange={(event) => setLength(Number(event.target.value))}
                />
              </div>
            )}
          </div>
          <button
            className="primary-button generate-button"
            onClick={createPassword}
            disabled={loading}
          >
            {loading ? (
              "Generating…"
            ) : (
              <>
                <Icon name="sparkles" size={17} /> Generate new password
              </>
            )}
          </button>
        </section>
        <aside className="tips-card">
          <span className="tips-icon">
            <Icon name="shield" size={21} />
          </span>
          <h2>Security tips</h2>
          <ul>
            <li>Use a unique password for every account.</li>
            <li>Longer passwords are harder to crack.</li>
            <li>Never share your master password.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Settings({ email }: { email: string }) {
  return (
    <div className="settings-view">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Your preferences</p>
          <h1>
            Account <em>settings.</em>
          </h1>
          <p className="page-subtitle">
            Manage your account and security preferences.
          </p>
        </div>
      </section>
      <section className="settings-card">
        <div className="settings-section">
          <div className="settings-heading">
            <span className="settings-icon">
              <Icon name="user" size={19} />
            </span>
            <div>
              <h2>Profile</h2>
              <p>Update the details associated with your account.</p>
            </div>
          </div>
          <label>Email address</label>
          <input type="email" value={email} readOnly />
          {/* TODO(frontend-backend): Submit profile changes to the account
              endpoint and show success or validation feedback. */}
          <button className="secondary-button">Save changes</button>
        </div>
        <div className="settings-section">
          <div className="settings-heading">
            <span className="settings-icon">
              <Icon name="lock" size={19} />
            </span>
            <div>
              <h2>Security</h2>
              <p>Keep your vault protected with these controls.</p>
            </div>
          </div>
          <button className="settings-row">
            {/* TODO(frontend-backend): Open the master-password change flow
                and submit the update through the account API. */}
            <span>
              <strong>Change master password</strong>
              <small>Update the password used to unlock your vault</small>
            </span>
            <Icon name="chevron" size={17} />
          </button>
          <button className="settings-row">
            {/* TODO(frontend-backend): Replace this placeholder state with
                the user's 2FA status and connect the setup flow. */}
            <span>
              <strong>Two-factor authentication</strong>
              <small>Add an extra layer of security to your account</small>
            </span>
            <span className="status-pill">Coming soon</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
