import { ReactNode } from "react";

export function Badge({ children, tone = "neutral", dot = false }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" | "neutral" | "purple"; dot?: boolean }) {
  return <span className={`badge badge-${tone}`}>{dot && <i />}{children}</span>;
}