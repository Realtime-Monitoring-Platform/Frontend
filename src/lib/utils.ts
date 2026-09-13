import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
    ACTIVE: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Active' },
    ONLINE: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Online' },
    INACTIVE: { dot: 'bg-slate-400', text: 'text-slate-600', label: 'Inactive' },
    OFFLINE: { dot: 'bg-slate-400', text: 'text-slate-600', label: 'Offline' },
    ERROR: { dot: 'bg-red-500', text: 'text-red-700', label: 'Error' },
    DEGRADED: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Degraded' },
};

export const getStatusStyle = (status?: string) =>
    STATUS_STYLES[(status || '').toUpperCase()] ?? {
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        label: status || 'Unknown',
    };

export const SEVERITY_STYLES: Record<string, { border: string; dot: string; text: string }> = {
    CRITICAL: { border: 'border-l-red-500', dot: 'bg-red-500', text: 'text-red-700' },
    HIGH: { border: 'border-l-orange-500', dot: 'bg-orange-500', text: 'text-orange-700' },
    MEDIUM: { border: 'border-l-amber-500', dot: 'bg-amber-500', text: 'text-amber-700' },
    LOW: { border: 'border-l-slate-400', dot: 'bg-slate-400', text: 'text-slate-600' },
};

export const getSeverityStyle = (severity: string) =>
    SEVERITY_STYLES[severity.toUpperCase()] ?? SEVERITY_STYLES.LOW;
