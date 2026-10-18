import { useState } from "react";
import type { SubmitEvent } from "react";
import { Icon } from "../components/Icon";
import type { VaultItem } from "../utils/types";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { generatePassword } from "../api/password";

export function ViewCredentialOverlay({
  item,
  onClose,
  onDeleted,
}: {
  item: VaultItem;
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

  function submit(event: SubmitEvent<HTMLFormElement>) {
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
