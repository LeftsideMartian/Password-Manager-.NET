import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import type { View, VaultItem } from "../utils/types";
import { useUser } from "../context/UserContext";
import { Credential } from "../components/Credential";
import { Stat } from "./Stat";
import { ViewCredentialOverlay } from "./ViewCredentialOverlay";
import { getCredentials } from "../api/credentials";

export function Overview({
  setView,
  onAddPassword,
}: {
  setView: (view: View) => void;
  onAddPassword: () => void;
}) {
  const { user } = useUser();
  const [selectedCredential, setSelectedCredential] =
    useState<VaultItem | null>(null);
  const [recentCredentials, setRecentCredentials] = useState<VaultItem[]>([]);
  const [credentialCount, setCredentialCount] = useState<number | null>(null);

  useEffect(() => {
    getCredentials()
      .then((items) => {
        setCredentialCount(items.length);
        setRecentCredentials(
          items.slice(0, 3).map((item) => ({
            credentialId: item.credentialId,
            title: item.name,
            username: item.username,
            password: item.password,
            category: item.category,
            notes: item.notes,
            color: "blue",
            initials: item.name.slice(0, 3).toUpperCase(),
          })),
        );
      })
      .catch(() => {
        setCredentialCount(null);
        setRecentCredentials([]);
      });
  }, []);

  return (
    <div className="overview">
      <section className="welcome-row">
        <div>
          {/* TODO: Use the current date or the user's
              locale-aware activity date instead of this demo date. */}
          <p className="eyebrow">Wednesday, October 14, 2026</p>
          <h1>
            Good evening, <em>{user?.firstName}.</em>
          </h1>
          <p className="page-subtitle">
            Everything important, safely in one place.
          </p>
        </div>
        <button className="primary-button" onClick={onAddPassword}>
          <Icon name="plus" size={18} /> Add password
        </button>
      </section>
      <section className="stats-grid">
        <Stat
          icon="key"
          label="Saved passwords"
          value={credentialCount === null ? "—" : String(credentialCount)}
          trend="Stored in your vault"
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
          {recentCredentials.map((item) => (
            <Credential
              item={item}
              key={item.credentialId}
              onOpen={() => setSelectedCredential(item)}
            />
          ))}
          {recentCredentials.length === 0 && (
            <p className="empty-state">No credentials saved yet.</p>
          )}
        </div>
      </section>
      {selectedCredential && (
        <ViewCredentialOverlay
          item={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onDeleted={() => setSelectedCredential(null)}
          onUpdated={(updated) => {
            setRecentCredentials((current) =>
              current.map((credential) =>
                credential.credentialId === updated.credentialId
                  ? {
                      ...credential,
                      title: updated.name,
                      username: updated.username,
                      password: updated.password,
                      category: updated.category,
                      notes: updated.notes,
                    }
                  : credential,
              ),
            );
            setSelectedCredential(null);
          }}
        />
      )}
    </div>
  );
}
