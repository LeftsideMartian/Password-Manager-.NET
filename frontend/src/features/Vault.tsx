import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import type { CredentialResponse } from "../utils/types";
import { Credential } from "../components/Credential";
import { CredentialOverlay } from "./CredentialOverlay";
import { getCredentials } from "../api/credentials";
import { toVaultItem } from "../utils/credentialDisplay";

export function Vault() {
  const [search, setSearch] = useState("");
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [credentials, setCredentials] = useState<CredentialResponse[]>([]);
  const [loadError, setLoadError] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCredential, setSelectedCredential] =
    useState<CredentialResponse | null>(null);

  // Load the logged-in user's credentials from GET /credential once,
  // when the vault is first shown.
  useEffect(() => {
    getCredentials()
      .then(setCredentials)
      .catch((err) =>
        setLoadError(
          err instanceof Error ? err.message : "Could not load credentials.",
        ),
      );
  }, []);

  // Replace the saved credential if it is already in the list, otherwise add it.
  function upsert(saved: CredentialResponse) {
    setCredentials((current) =>
      current.some((c) => c.credentialId === saved.credentialId)
        ? current.map((c) => (c.credentialId === saved.credentialId ? saved : c))
        : [...current, saved],
    );
  }

  const items = credentials.map(toVaultItem);

  const filtered = items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.username} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  return (
    <div className="vault-view">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Your secure collection</p>
          <h1>My vault.</h1>
          <p className="page-subtitle">
            {credentials.length} credentials protected by NetPass.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => setShowAddOverlay(true)}
        >
          <Icon name="plus" size={18} /> Add credential
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
          aria-label="Filter by type"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((option) => (
            <option value={option} key={option}>
              {option === "All" ? "All types" : option}
            </option>
          ))}
        </select>
      </div>
      <div className="vault-list">
        {filtered.map((item) => (
          <Credential
            item={item}
            key={item.credential?.credentialId ?? item.title}
            onOpen={() => setSelectedCredential(item.credential ?? null)}
          />
        ))}
        {loadError && (
          <div className="empty-state">Could not load your vault: {loadError}</div>
        )}
        {!loadError && filtered.length === 0 && (
          <div className="empty-state">No credentials match your search.</div>
        )}
      </div>
      {showAddOverlay && (
        <CredentialOverlay
          onClose={() => setShowAddOverlay(false)}
          onSaved={(saved) => {
            upsert(saved);
            setShowAddOverlay(false);
          }}
        />
      )}
      {selectedCredential && (
        <CredentialOverlay
          // key forces a fresh form when a different credential is opened
          key={selectedCredential.credentialId}
          existing={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onSaved={(saved) => {
            upsert(saved);
            setSelectedCredential(null);
          }}
          onDeleted={(credentialId) => {
            // Only removed from the list after the DELETE request succeeded.
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
