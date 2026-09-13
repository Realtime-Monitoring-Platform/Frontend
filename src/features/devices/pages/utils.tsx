

export const Spec = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate font-mono text-sm text-foreground">{value || '—'}</p>
    </div>
);

export const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="truncate text-right font-medium">{value ?? 'N/A'}</span>
    </div>
);

export const InfoRowMono = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="truncate text-right font-mono text-[13px]">{value || 'N/A'}</span>
    </div>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-1 text-sm font-semibold text-foreground">{children}</h3>
);