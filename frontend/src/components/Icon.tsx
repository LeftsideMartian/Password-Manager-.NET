export type IconName =
  | "arrow"
  | "chevron"
  | "copy"
  | "eye"
  | "grid"
  | "key"
  | "lock"
  | "logout"
  | "menu"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "sparkles"
  | "user"
  | "x";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, string> = {
    arrow: "M5 12h14M13 6l6 6-6 6",
    chevron: "M9 18l6-6-6-6",
    copy: "M9 9h10v10H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
    eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    key: "M15.5 8.5a4 4 0 1 0-7.8 1.3L3 14.5V18h3v-2h2v-2h2.5l1.2-1.2a4 4 0 0 0 3.8-4.3ZM15 8h.01",
    lock: "M5 10h14v10H5zM8 10V7a4 4 0 0 1 8 0v3M12 14v2",
    logout: "M10 17l5-5-5-5M15 12H3M21 4v16",
    menu: "M4 6h16M4 12h16M4 18h16",
    plus: "M12 5v14M5 12h14",
    search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2-1.1L14.2 3h-4.4l-.4 2.7a8 8 0 0 0-2 1.1l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z",
    shield: "M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z",
    sparkles: "m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3ZM19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z",
    user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    x: "M6 6l12 12M18 6 6 18",
  };

  return (
    <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
