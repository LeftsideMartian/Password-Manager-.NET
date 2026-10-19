import { useState } from "react";
import { Icon } from "../components/Icon";
import type { VaultItem } from "../utils/types";
import { Credential } from "../components/Credential";
import { AddCredentialOverlay } from "./AddCredentialOverlay";
import { ViewCredentialOverlay } from "./ViewCredentialOverlay";

export function Vault() {
  const [search, setSearch] = useState("");
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  // TODO: Load credentials for the authenticated user and
  // keep this list in sync after create, update, and delete requests.
  const [credentials, setCredentials] = useState<VaultItem[]>([]);
  const [category, setCategory] = useState("All");
  const [selectedCredential, setSelectedCredential] =
    useState<VaultItem | null>(null);

  const filtered = credentials.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.username} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const categories = [
    "All",
    ...new Set(credentials.map((item) => item.category)),
  ];

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
        {filtered.map((item) => (
          <Credential
            item={item}
            key={item.title}
            onOpen={() => setSelectedCredential(item)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">No credentials match your search.</div>
        )}
      </div>
      {showAddOverlay && (
        <AddCredentialOverlay onClose={() => setShowAddOverlay(false)} />
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
                (credential) => credential.title !== selectedCredential.title,
              ),
            );
            setSelectedCredential(null);
          }}
        />
      )}
    </div>
  );
}
