import { ReactNode } from "react";
import { Icon, IconName } from "./Icon";



export function Button({ children, variant = "primary", icon, onClick, className = "" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "dark"; icon?: IconName; onClick?: () => void; className?: string }) {
  return <button className={`btn btn-${variant} ${className}`} onClick={onClick}>{icon && <Icon name={icon} size={16} />}{children}</button>;
}


