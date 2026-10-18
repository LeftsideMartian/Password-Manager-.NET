import { useState } from "react";
import { Icon } from "../components/Icon";
import { useUser } from "../context/UserContext";
import type { User } from "../utils/types";

export function Settings() {
  const { user } = useUser();
  const [newUserDetails, setNewUserDetails] = useState<User>(
    user ?? ({} as User),
  );

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
              readOnly
            />
          </div>

          {/* TODO(frontend-backend): Submit profile changes to the account
              endpoint and show success or validation feedback. */}
          <button className="secondary-button">Save changes</button>
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

          <button className="settings-row">
            {/* TODO(frontend-backend): Open the master-password change flow
                and submit the update through the account API. */}
            <span>
              <strong>Change master password</strong>
              <small>Update the password used to unlock your vault</small>
            </span>
            <Icon name="chevron" size={17} />
          </button>

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
