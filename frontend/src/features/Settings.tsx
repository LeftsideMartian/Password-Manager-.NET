import { useState, type SubmitEvent } from "react";
import { Icon } from "../components/Icon";
import { useUser } from "../context/UserContext";
import { changePassword, updateUser as updateUserRequest } from "../api/user";
import type { UpdateUserRequest, User } from "../utils/types";

export function Settings() {
  const { user, updateUser } = useUser();
  const [newUserDetails, setNewUserDetails] = useState<User>(
    user ?? ({} as User),
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function saveProfile() {
    if (!user) return;

    const request: UpdateUserRequest = {
      firstName: newUserDetails.firstName,
      lastName: newUserDetails.lastName,
      email: newUserDetails.email,
    };

    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      await updateUserRequest(user.userId, request);
      updateUser(newUserDetails);
      setProfileSuccess("Profile updated successfully.");
    } catch {
      setProfileError("We could not update your profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function savePassword(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      await changePassword(user.userId, { newPassword });
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Master password updated successfully.");
    } catch {
      setPasswordError(
        "We could not update your master password. Please try again.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="settings-view">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Your preferences</p>
          <h1>
            Account <em>settings.</em>
          </h1>
          <p className="page-subtitle">
            Manage your account and security preferences.
          </p>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-section">
          <div className="settings-heading">
            <span className="settings-icon">
              <Icon name="user" size={19} />
            </span>
            <div>
              <h2>Profile</h2>
              <p>Update the details associated with your account.</p>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="first-name">First Name</label>
            <input
              id="first-name"
              type="text"
              value={newUserDetails.firstName}
              onChange={(event) =>
                setNewUserDetails((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
            />
          </div>

          <div className="settings-field">
            <label htmlFor="last-name">Last Name</label>
            <input
              id="last-name"
              type="text"
              value={newUserDetails.lastName}
              onChange={(event) =>
                setNewUserDetails((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
            />
          </div>

          <div className="settings-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={newUserDetails.email}
              onChange={(event) => {
                setNewUserDetails((current) => ({
                  ...current,
                  email: event.target.value,
                }));
              }}
            />
          </div>

          {profileError && <p className="form-error">{profileError}</p>}
          {profileSuccess && (
            <p className="settings-success">{profileSuccess}</p>
          )}
          <button
            className="secondary-button"
            type="button"
            onClick={saveProfile}
            disabled={profileLoading}
          >
            {profileLoading ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-heading">
            <span className="settings-icon">
              <Icon name="lock" size={19} />
            </span>
            <div>
              <h2>Security</h2>
              <p>Keep your vault protected with these controls.</p>
            </div>
          </div>

          <button
            className="settings-row"
            type="button"
            onClick={() => {
              setShowPasswordForm((current) => !current);
              setPasswordError("");
              setPasswordSuccess("");
            }}
          >
            <span>
              <strong>Change master password</strong>
              <small>Update the password used to unlock your vault</small>
            </span>
            <Icon name="chevron" size={17} />
          </button>
          {showPasswordForm && (
            <form className="settings-password-form" onSubmit={savePassword}>
              <div className="settings-field">
                <label htmlFor="new-password">New master password</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>
              <div className="settings-field">
                <label htmlFor="confirm-password">
                  Confirm master password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
              {passwordError && <p className="form-error">{passwordError}</p>}
              {passwordSuccess && (
                <p className="settings-success">{passwordSuccess}</p>
              )}
              <button
                className="secondary-button"
                type="submit"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}

          <button className="settings-row" style={{ cursor: "default" }}>
            {/* TODO(frontend-backend): Replace this placeholder state with
                the user's 2FA status and connect the setup flow. */}
            <span>
              <strong>Two-factor authentication</strong>
              <small>Add an extra layer of security to your account</small>
            </span>
            <span className="status-pill">Coming soon</span>
          </button>
        </div>
      </section>
    </div>
  );
}
