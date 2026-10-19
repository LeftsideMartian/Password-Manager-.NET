import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import type { VaultItem } from "../utils/types";
import { Credential } from "../components/Credential";
import { AddCredentialOverlay } from "./AddCredentialOverlay";
import { ViewCredentialOverlay } from "./ViewCredentialOverlay";
import { getCredentials } from "../api/credentials";

export function Vault({
  openAddPassword,
  onAddPasswordOpened,
}: {
  openAddPassword: boolean;
  onAddPasswordOpened: () => void;
}) {
  const [search, setSearch] = useState("");
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [credentials, setCredentials] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCredential, setSelectedCredential] =
    useState<VaultItem | null>(null);

  useEffect(() => {
    if (openAddPassword) {
      setShowAddOverlay(true);
      onAddPasswordOpened();
    }
  }, [onAddPasswordOpened, openAddPassword]);

  useEffect(() => {
    getCredentials()
      .then((items) =>
        setCredentials(
          items.map((item) => ({
            credentialId: item.credentialId,
            title: item.name,
            username: item.username,
            password: item.password,
            category: item.category,
            notes: item.notes,
            color: "blue",
            initials: item.name.slice(0, 3).toUpperCase(),
          })),
        ),
      )
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load credentials.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

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
          onClose={() => setShowAddOverlay(false)}
          onCreated={(created) =>
            setCredentials((current) => [
              ...current,
              {
                credentialId: created.credentialId,
                title: created.name,
                username: created.username,
                password: created.password,
                category: created.category,
                notes: created.notes,
                color: "blue",
                initials: created.name.slice(0, 3).toUpperCase(),
              },
            ])
          }
        />
      )}
      {selectedCredential && (
        <ViewCredentialOverlay
          item={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onDeleted={() => {
            setCredentials((current) =>
              current.filter(
                (credential) =>
                  credential.credentialId !== selectedCredential.credentialId,
              ),
            );
            setSelectedCredential(null);
          }}
          onUpdated={(updated) =>
            setCredentials((current) =>
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
            )
          }
        />
      )}
    </div>
  );
}
