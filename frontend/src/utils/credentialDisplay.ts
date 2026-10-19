import type { CredentialResponse, VaultItem } from "./types";

// Turns a credential returned by the backend into the shape the vault list
// already knows how to draw (title, subtitle, category badge, coloured logo).
export function toVaultItem(credential: CredentialResponse): VaultItem {
  switch (credential.type) {
    case "login":
      return {
        title: credential.username,
        username: credential.notes || "Login",
        category: "Login",
        color: "blue",
        initials: credential.username.slice(0, 2).toUpperCase(),
        credential,
      };
    case "ssh_key":
      return {
        title: "SSH key",
        username: credential.notes || `${credential.key.slice(0, 24)}…`,
        category: "SSH key",
        color: "orange",
        initials: "SSH",
        credential,
      };
    case "payment_card":
      return {
        title: `Card ending ${credential.cardNumber.slice(-4)}`,
        username: `Expires ${credential.expiryDate}`,
        category: "Payment card",
        color: "red",
        initials: "CC",
        credential,
      };
  }
}

// The value the "copy" button on a row should put on the clipboard.
export function secretOf(credential: CredentialResponse): string {
  switch (credential.type) {
    case "login":
      return credential.password;
    case "ssh_key":
      return credential.key;
    case "payment_card":
      return credential.cardNumber;
  }
}
