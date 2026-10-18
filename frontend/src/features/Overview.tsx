import { useState } from "react";
import { Icon, type IconName } from "../components/Icon";
import { vaultItems as sharedVaultItems } from "./vaultData";
import type { View, VaultItem } from "./types";
import { ViewCredentialOverlay } from "./overlays";

export function Overview({
  firstName,
  setView,
}: {
  firstName: string;
  setView: (view: View) => void;
}) {
  const [selectedCredential, setSelectedCredential] = useState<
    VaultItem | null
  >(null);

  return (
    <div className="overview">
      <section className="welcome-row">
        <div>
          {/* TODO: Use the current date or the user's
              locale-aware activity date instead of this demo date. */}
          <p className="eyebrow">Wednesday, October 14, 2026</p>
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

export function Stat({
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

export function Credential({
  item,
  onOpen,
}: {
  item: VaultItem;
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
