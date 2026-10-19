import { useState } from "react";
import { Icon } from "./Icon";
import type { VaultItem } from "../utils/types";
import { secretOf } from "../utils/credentialDisplay";

export function Credential({
  item,
  onOpen,
}: {
  item: VaultItem;
  onOpen?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <article
      className={`credential-row ${onOpen ? "credential-row-clickable" : ""}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (onOpen && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <span className={`site-logo ${item.color}`}>{item.initials}</span>
      <div className="credential-copy">
        <strong>{item.title}</strong>
        <span>{item.username}</span>
      </div>
      <span className="category">{item.category}</span>
      <button
        className="row-action"
        aria-label={`Copy ${item.title} password`}
        onClick={(event) => {
          event.stopPropagation();
          if (item.credential) {
            navigator.clipboard?.writeText(secretOf(item.credential));
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : <Icon name="copy" size={17} />}
      </button>
      <button
        className="row-chevron"
        aria-label={`Open ${item.title}`}
        onClick={(event) => {
          event.stopPropagation();
          onOpen?.();
        }}
      >
        <Icon name="chevron" size={17} />
      </button>
    </article>
  );
}
