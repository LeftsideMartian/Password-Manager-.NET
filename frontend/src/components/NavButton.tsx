import { Icon, type IconName } from "./Icon";

export function NavButton({
  active,
  icon,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  icon: IconName;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <Icon name={icon} size={18} />
      <span>{label}</span>
      {badge && <small>{badge}</small>}
    </button>
  );
}
