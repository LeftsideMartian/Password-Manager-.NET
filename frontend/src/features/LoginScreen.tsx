import { useState } from "react";
import type { SubmitEvent } from "react";
import { Icon } from "../components/Icon";
import { login, register } from "../api/auth";
import { useUser } from "../context/UserContext";

export function LoginScreen() {
  const { signIn } = useUser();

  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      // Register first if needed, then authenticate to create an auth session
      if (isRegistering) {
        await register(firstName, lastName, email, password);
      }

      signIn(await login(email, password));
    } catch {
      setError(
        isRegistering
          ? "We could not create your account. Check your details and try again."
          : "We could not sign you in. Check your details and try again.",
      );
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
        <div className="auth-heading"></div>
        <form onSubmit={submit} className="auth-form">
          {isRegistering && (
            <>
              <div className="auth-field">
                <label htmlFor="first-name">First name</label>
                <input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="last-name">Last name</label>
                <input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="auth-field">
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
          </div>
          <div className="auth-field">
            <div className="label-row">
              <label htmlFor="password">
                {isRegistering ? "Create a master password" : "Master password"}
              </label>
              {!isRegistering && (
                <button type="button" className="text-button">
                  Forgot password?
                </button>
              )}
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
          </div>
          {error && <p className="form-error">{error}</p>}
          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              isRegistering ? (
                "Creating account…"
              ) : (
                "Signing in…"
              )
            ) : (
              <>
                {isRegistering ? "Create account" : "Sign in"}
                <Icon name="arrow" size={17} />
              </>
            )}
          </button>
        </form>
        <p className="auth-footer">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setIsRegistering((current) => !current);
              setError("");
            }}
          >
            {isRegistering ? "Sign in" : "Create one"}
          </button>
        </p>
      </section>
    </main>
  );
}
