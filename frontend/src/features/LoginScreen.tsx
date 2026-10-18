import { useState } from "react";
import type { SubmitEvent } from "react";
import { login } from "../api";
import { Icon } from "../components/Icon";

export function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(email, password);
      localStorage.setItem("token", session.token);
      onLogin(session.email);
    } catch {
      setError("We could not sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <section className="auth-card">
        <div className="brand brand-centered">
          <span className="brand-mark">
            <Icon name="shield" size={20} />
          </span>
          <span>NetPass</span>
        </div>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1>
            Your passwords, <em>protected.</em>
          </h1>
          <p className="auth-subtitle">Sign in to access your secure vault.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <div className="label-row">
            <label htmlFor="password">Master password</label>
            <button type="button" className="text-button">
              Forgot password?
            </button>
          </div>
          <div className="input-with-icon">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your master password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="input-action"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon name="eye" size={18} />
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Signing in…"
            ) : (
              <>
                Unlock vault <Icon name="arrow" size={17} />
              </>
            )}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <button type="button" className="text-button">
            Create one
          </button>
        </p>
        {import.meta.env.DEV && (
          <button
            type="button"
            className="preview-button"
            onClick={() => onLogin("demo@example.com")}
          >
            Preview the app <Icon name="arrow" size={14} />
          </button>
        )}
        <div className="auth-trust">
          <Icon name="lock" size={14} /> End-to-end encrypted · Your data stays
          yours
        </div>
      </section>
    </main>
  );
}
