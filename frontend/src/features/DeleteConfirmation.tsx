import { Icon } from "../components/Icon";

export function DeleteConfirmation({
  credentialName,
  onCancel,
  onConfirm,
}: {
  credentialName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="confirmation-backdrop" role="presentation">
      <section
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-credential-title"
      >
        <span className="delete-icon">
          <Icon name="x" size={21} />
        </span>
        <h2 id="delete-credential-title">Delete this credential?</h2>
        <p>
          <strong>{credentialName}</strong> will be permanently removed from
          your vault. This action cannot be undone.
        </p>
        <div className="confirmation-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Keep credential
          </button>
          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Delete permanently
          </button>
        </div>
      </section>
    </div>
  );
}
