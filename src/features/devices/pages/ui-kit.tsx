import type { ReactNode } from "react";

/* EdgePulse building blocks, expressed in Tailwind + shadcn tokens so they
   follow your existing light/dark theme. */

export type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "purple";

const toneClasses: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  purple: "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
  neutral: "bg-muted text-muted-foreground ring-border",
};

const dotClasses: Record<Tone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  purple: "bg-violet-500",
  neutral: "bg-muted-foreground/60",
};

export function Pill({ children, tone = "neutral", dot = false, className = "" }: { children: ReactNode; tone?: Tone; dot?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]} ${className}`}>
      {dot && <i className={`h-1.5 w-1.5 rounded-full ${dotClasses[tone]}`} />}
      {children}
    </span>
  );
}

export function PulseDot({ tone = "success", active = true }: { tone?: Tone; active?: boolean }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {active && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dotClasses[tone]}`} />}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClasses[tone]}`} />
    </span>
  );
}

const tileTones = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  orange: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  purple: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
};

export function StatTile({ label, value, hint, icon, tone = "blue", mono = false, leading }: { label: string; value?: ReactNode; hint?: string; icon?: ReactNode; tone?: keyof typeof tileTones; mono?: boolean; leading?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tileTones[tone]}`}>{leading ?? icon}</span>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className={`mt-3 truncate text-xl font-semibold tracking-tight ${mono ? "font-mono text-base" : ""}`}>{value || "—"}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SectionHead({ title, subtitle, icon, actions }: { title: string; subtitle?: string; icon?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">{icon}{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}>{children}</section>;
}