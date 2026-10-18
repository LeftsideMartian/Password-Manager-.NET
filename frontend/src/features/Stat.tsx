import { Icon, type IconName } from "../components/Icon";

export function Stat({
  icon,
  label,
  value,
  trend,
  tone = "orange",
}: {
  icon: IconName;
  label: string;
  value: string;
  trend: string;
  tone?: string;
}) {
  return (
    <article className="stat-card">
      <span className={`stat-icon ${tone}`}>
        <Icon name={icon} size={19} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small className={tone === "green" ? "positive" : ""}>{trend}</small>
      </div>
    </article>
  );
}
