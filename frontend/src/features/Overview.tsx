import { useState } from "react";
import { Icon } from "../components/Icon";
import { vaultItems as sharedVaultItems } from "../utils/vaultData";
import type { View, VaultItem } from "../utils/types";
import { useUser } from "../context/UserContext";
import { Credential } from "../components/Credential";
import { Stat } from "./Stat";
import { ViewCredentialOverlay } from "./ViewCredentialOverlay";

export function Overview({ setView }: { setView: (view: View) => void }) {
  const { user } = useUser();
  const [selectedCredential, setSelectedCredential] =
    useState<VaultItem | null>(null);

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
        <button className="primary-button" onClick={() => setView("generator")}>
          <Icon name="plus" size={18} /> Add password
        </button>
      </section>
      <section className="stats-grid">
        {/* TODO: Replace these demo values with vault
            statistics and the latest security-check result from the backend. */}
        <Stat
          icon="key"
          label="Saved passwords"
          value="12"
          trend="+2 this month"
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
          {/* TODO: Render the user's latest credentials,
              ordered by the backend's saved/updated timestamp. */}
          {sharedVaultItems.slice(0, 3).map((item) => (
            <Credential
              item={item}
              key={item.title}
              onOpen={() => setSelectedCredential(item)}
            />
          ))}
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
