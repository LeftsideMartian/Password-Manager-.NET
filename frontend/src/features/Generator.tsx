import { useState } from "react";
import { generatePassword } from "../api";
import { Icon } from "../components/Icon";

export function Generator() {
  const [profile, setProfile] = useState<"Strong" | "EasyToType">("Strong");
  const [length, setLength] = useState(20);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
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

  return (
    <div className="generator-view">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Built for better security</p>
          <h1>
            Password <em>generator.</em>
          </h1>
          <p className="page-subtitle">
            Create a strong password you can trust.
          </p>
        </div>
      </section>
      <div className="generator-layout">
        <section className="generator-card">
          <div className="generator-card-heading">
            <span className="large-icon">
              <Icon name="sparkles" size={24} />
            </span>
            <div>
              <h2>Make a new password</h2>
              <p>Customise it to fit your needs.</p>
            </div>
          </div>
          <div className="password-result">
            <code>
              {password || "Your generated password will appear here"}
            </code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              aria-label="Copy generated password"
              disabled={!password}
            >
              <Icon name="copy" size={19} />
            </button>
          </div>
          {copied && (
            <p className="copied-message">Password copied to clipboard.</p>
          )}
          {generationError && (
            <p className="generation-error">{generationError}</p>
          )}
          <div className="generator-options">
            <div>
              <label>Style</label>
              <div className="segmented">
                <button
                  className={profile === "Strong" ? "selected" : ""}
                  onClick={() => setProfile("Strong")}
                >
                  Strong
                </button>
                <button
                  className={profile === "EasyToType" ? "selected" : ""}
                  onClick={() => setProfile("EasyToType")}
                >
                  Easy to type
                </button>
              </div>
            </div>
            {profile === "Strong" && (
              <div>
                <div className="label-row">
                  <label htmlFor="length">Length</label>
                  <strong>{length} characters</strong>
                </div>
                <input
                  id="length"
                  type="range"
                  min="12"
                  max="40"
                  value={length}
                  onChange={(event) => setLength(Number(event.target.value))}
                />
              </div>
            )}
          </div>
          <button
            className="primary-button generate-button"
            onClick={createPassword}
            disabled={loading}
          >
            {loading ? (
              "Generating…"
            ) : (
              <>
                <Icon name="sparkles" size={17} /> Generate new password
              </>
            )}
          </button>
        </section>
        <aside className="tips-card">
          <span className="tips-icon">
            <Icon name="shield" size={21} />
          </span>
          <h2>Security tips</h2>
          <ul>
            <li>Use a unique password for every account.</li>
            <li>Longer passwords are harder to crack.</li>
            <li>Never share your master password.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
