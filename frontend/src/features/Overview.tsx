import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import type { CredentialResponse, View } from "../utils/types";
import { useUser } from "../context/UserContext";
import { Credential } from "../components/Credential";
import { Stat } from "./Stat";
import { CredentialOverlay } from "./CredentialOverlay";
import { getCredentials } from "../api/credentials";
import { toVaultItem } from "../utils/credentialDisplay";

export function Overview({
  setView,
  onCountChange,
}: {
  setView: (view: View) => void;
  onCountChange?: (count: number) => void;
}) {
  const { user } = useUser();
  const [credentials, setCredentials] = useState<CredentialResponse[]>([]);
  const [selectedCredential, setSelectedCredential] =
    useState<CredentialResponse | null>(null);

  useEffect(() => {
    getCredentials().then(setCredentials).catch(() => setCredentials([]));
  }, []);

  useEffect(() => {
    onCountChange?.(credentials.length);
  }, [credentials, onCountChange]);

  // Newest first: a higher id means it was created later.
  const recent = [...credentials]
    .sort((a, b) => b.credentialId - a.credentialId)
    .slice(0, 3);

  return (
    <div className="overview">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1>
            Good evening, <em>{user?.firstName}.</em>
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
        {/* TODO: Replace these demo values with vault
            statistics and the latest security-check result from the backend. */}
        <Stat
          icon="key"
          label="Saved credentials"
          value={String(credentials.length)}
          trend="Stored encrypted"
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
          {recent.map((credential) => (
            <Credential
              item={toVaultItem(credential)}
              key={credential.credentialId}
              onOpen={() => setSelectedCredential(credential)}
            />
          ))}
          {recent.length === 0 && (
            <div className="empty-state">No credentials saved yet.</div>
          )}
        </div>
      </section>
      {selectedCredential && (
        <CredentialOverlay
          key={selectedCredential.credentialId}
          existing={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onSaved={(saved) => {
            setCredentials((current) =>
              current.map((c) =>
                c.credentialId === saved.credentialId ? saved : c,
              ),
            );
            setSelectedCredential(null);
          }}
          onDeleted={(credentialId) => {
            setCredentials((current) =>
              current.filter((c) => c.credentialId !== credentialId),
            );
            setSelectedCredential(null);
          }}
        />
      )}
    </div>
  );
}
