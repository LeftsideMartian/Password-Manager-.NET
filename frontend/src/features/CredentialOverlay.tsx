import { useState } from "react";
import type { SubmitEvent } from "react";
import { Icon } from "../components/Icon";
import { generatePassword } from "../api/password";
import {
  createLoginCredential,
  createPaymentCardCredential,
  createSshKeyCredential,
  deleteCredential,
  updateLoginCredential,
  updatePaymentCardCredential,
  updateSshKeyCredential,
} from "../api/credentials";
import type { CredentialResponse } from "../utils/types";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CredentialType = CredentialResponse["type"];

const typeLabels: Record<CredentialType, string> = {
  login: "Login",
  ssh_key: "SSH key",
  payment_card: "Payment card",
};

// One dialog for both adding and editing. If `existing` is given we are
// editing that credential, otherwise we are creating a new one.
export function CredentialOverlay({
  existing,
  onClose,
  onSaved,
  onDeleted,
}: {
  existing?: CredentialResponse;
  onClose: () => void;
  onSaved: (credential: CredentialResponse) => void;
  onDeleted?: (credentialId: number) => void;
}) {
  const isEditing = existing !== undefined;
  const [type, setType] = useState<CredentialType>(existing?.type ?? "login");

  // Each field starts with the existing value when editing, or empty when adding.
  const [username, setUsername] = useState(
    existing?.type === "login" ? existing.username : "",
  );
  const [password, setPassword] = useState(
    existing?.type === "login" ? existing.password : "",
  );
  const [sshKey, setSshKey] = useState(
    existing?.type === "ssh_key" ? existing.key : "",
  );
  const [cardNumber, setCardNumber] = useState(
    existing?.type === "payment_card" ? existing.cardNumber : "",
  );
  const [expiryDate, setExpiryDate] = useState(
    existing?.type === "payment_card" ? existing.expiryDate : "",
  );
  const [cvv, setCvv] = useState(
    existing?.type === "payment_card" ? existing.cvv : "",
  );
  const [notes, setNotes] = useState(existing?.notes ?? "");

  const [showSecret, setShowSecret] = useState(!isEditing);
  const [showGenerator, setShowGenerator] = useState(false);
  const [profile, setProfile] = useState<"Strong" | "EasyToType">("Strong");
  const [length, setLength] = useState(20);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  async function createPassword() {
    setGenerating(true);
    setError("");
    try {
      const result = await generatePassword(
        profile,
        profile === "Strong" ? length : undefined,
      );
      setPassword(result.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  // Sends the right create or update request for the selected type.
  function save(): Promise<CredentialResponse> {
    const cleanNotes = notes.trim() === "" ? null : notes;
    const id = existing?.credentialId;

    switch (type) {
      case "login": {
        const request = { username, password, notes: cleanNotes };
        return id === undefined
          ? createLoginCredential(request)
          : updateLoginCredential(id, request);
      }
      case "ssh_key": {
        const request = { key: sshKey, notes: cleanNotes };
        return id === undefined
          ? createSshKeyCredential(request)
          : updateSshKeyCredential(id, request);
      }
      case "payment_card": {
        const request = {
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryDate,
          cvv,
          notes: cleanNotes,
        };
        return id === undefined
          ? createPaymentCardCredential(request)
          : updatePaymentCardCredential(id, request);
      }
    }
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = await save();
      onSaved(saved);
    } catch (err) {
      // A 400 here usually means the backend validation rejected a field,
      // for example a card number that fails the [CreditCard] check.
      setError(
        err instanceof Error
          ? `Could not save: ${err.message}. Check the details and try again.`
          : "Could not save the credential.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!existing) return;
    try {
      await deleteCredential(existing.credentialId);
      onDeleted?.(existing.credentialId);
    } catch (err) {
      setShowDeleteConfirmation(false);
      setError(err instanceof Error ? `Could not delete: ${err.message}` : "Could not delete.");
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
        aria-labelledby="credential-title"
      >
        <header className="overlay-header">
          <div>
            <p className="eyebrow">
              {isEditing ? "Credential details" : "Securely store a credential"}
            </p>
            <h2 id="credential-title">
              {isEditing ? `Edit ${typeLabels[type].toLowerCase()}` : "Add a credential"}
            </h2>
            <p>Secrets are encrypted by the backend before they are stored.</p>
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
            {/* The type can only be chosen when adding; the backend has a
                separate update endpoint per type. */}
            {!isEditing && (
              <div className="field-wide">
                <label>Type</label>
                <div className="segmented">
                  {(Object.keys(typeLabels) as CredentialType[]).map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={type === option ? "selected" : ""}
                      onClick={() => setType(option)}
                    >
                      {typeLabels[option]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {type === "login" && (
              <>
                <div className="field-wide">
                  <label htmlFor="credential-username">Username or email</label>
                  <input
                    id="credential-username"
                    placeholder="you@example.com"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    maxLength={200}
                    required
                  />
                </div>
                <div className="field-wide">
                  <label htmlFor="credential-password">Password</label>
                  <div className="overlay-password">
                    <input
                      id="credential-password"
                      type={showSecret ? "text" : "password"}
                      placeholder="Enter or generate a password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      maxLength={200}
                      required
                    />
                    <div className="password-actions">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(password)}
                        aria-label="Copy password"
                      >
                        <Icon name="copy" size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        aria-label={showSecret ? "Hide password" : "Show password"}
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
                    {showGenerator ? "Hide generator" : "Generate a strong password"}{" "}
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
                          onChange={(event) => setLength(Number(event.target.value))}
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      className="secondary-button generate-inline"
                      onClick={createPassword}
                      disabled={generating}
                    >
                      <Icon name="sparkles" size={15} />{" "}
                      {generating ? "Generating…" : "Generate and use password"}
                    </button>
                  </div>
                )}
              </>
            )}

            {type === "ssh_key" && (
              <div className="field-wide">
                <label htmlFor="credential-key">SSH key</label>
                <textarea
                  id="credential-key"
                  placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                  rows={6}
                  value={sshKey}
                  onChange={(event) => setSshKey(event.target.value)}
                  maxLength={10000}
                  required
                />
              </div>
            )}

            {type === "payment_card" && (
              <>
                <div className="field-wide">
                  <label htmlFor="credential-card">Card number</label>
                  <input
                    id="credential-card"
                    inputMode="numeric"
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="credential-expiry">Expiry date</label>
                  {/* type="date" gives "YYYY-MM-DD", which is the format
                      the backend's DateOnly expects. */}
                  <input
                    id="credential-expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="credential-cvv">CVV</label>
                  <input
                    id="credential-cvv"
                    type={showSecret ? "text" : "password"}
                    inputMode="numeric"
                    pattern="\d{3,4}"
                    title="3 or 4 digits"
                    placeholder="123"
                    value={cvv}
                    onChange={(event) => setCvv(event.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="field-wide">
              <label htmlFor="credential-notes">
                Notes <span className="optional">(optional)</span>
              </label>
              <textarea
                id="credential-notes"
                placeholder="e.g. which website or account this is for"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={2000}
              />
            </div>

            {error && <p className="generation-error field-wide">{error}</p>}
          </div>
          <footer className="overlay-footer">
            {isEditing && (
              <>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  <Icon name="x" size={15} /> Delete credential
                </button>
                <span className="overlay-footer-spacer" />
              </>
            )}
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={saving}>
              <Icon name="lock" size={15} />{" "}
              {saving ? "Saving…" : isEditing ? "Save changes" : "Save credential"}
            </button>
          </footer>
        </form>
      </section>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          credentialName={typeLabels[type]}
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
