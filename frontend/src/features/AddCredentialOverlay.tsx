import { useState } from "react";
import type { SubmitEvent } from "react";
import { generatePassword } from "../api";
import { Icon } from "../components/Icon";

export function AddCredentialOverlay({ onClose }: { onClose: () => void }) {
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

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Persist the new credential before closing the
    // dialog, then refresh the vault list from the backend.
    onClose();
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
              />
            </div>
          </div>
          <footer className="overlay-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              <Icon name="lock" size={15} /> Save credential
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
