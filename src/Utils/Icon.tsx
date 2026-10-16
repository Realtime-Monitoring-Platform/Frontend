import { ReactNode } from "react";

export type IconName =
  | "activity"
  | "alert"
  | "ai"
  | "bell"
  | "check"
  | "chevron"
  | "clipboard"
  | "command"
  | "cpu"
  | "device"
  | "docs"
  | "external"
  | "filter"
  | "grid"
  | "logs"
  | "menu"
  | "moon"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "team"
  | "tenant"
  | "users";

export const iconPaths: Record<IconName, ReactNode> = {
  activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
  alert: <><path d="M12 3 2.8 19h18.4L12 3Z" /><path d="M12 9v4M12 16.5v.5" /></>,
  ai: <><path d="M12 3 9.8 8.3 4 10.5l5.8 2.2L12 18l2.2-5.3 5.8-2.2-5.8-2.2L12 3Z" /><path d="m5 3 .7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8-1.8-.7 1.8-.7L5 3Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M10 19h4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  clipboard: <><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6" /></>,
  command: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m7 10 2 2-2 2M12 14h5" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3M10 10h4v4h-4z" /></>,
  device: <><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M8 6h8M10 18h4" /></>,
  docs: <><path d="M5 3h10l4 4v14H5z" /><path d="M14 3v5h5M8 12h8M8 16h8" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v7H4V6h7" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  logs: <><path d="M4 5h16M4 10h16M4 15h10M4 20h12" /><path d="M7 3v4M16 8v4" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  shield: <><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20v-2a5 5 0 0 1 10 0v2M14 15a4 4 0 0 1 7 3v2" /></>,
  tenant: <><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1M14 10h1M9 14h1M14 14h1M9 18h6" /></>,
  users: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20v-2a6 6 0 0 1 12 0v2M15 14.5a5 5 0 0 1 7 4.5v1" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}