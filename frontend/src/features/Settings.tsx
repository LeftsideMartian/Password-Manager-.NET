import { Icon } from "../components/Icon";

export function Settings({ email }: { email: string }) {
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
          <label>Email address</label>
          <input type="email" value={email} readOnly />
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
          <button className="settings-row">
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
