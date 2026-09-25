import { Button } from "@/components/ui/button";
import { getSeverityStyle } from "@/lib/utils";
import { AiIncident } from "@/types";
import { AlertTriangle, CheckCircle2, ChevronDown, CircleGauge, Clock3, Wrench } from "lucide-react";

const IncidentSummary = ({
  incident,
  expanded,
  onToggle,
  onApprove,
  approvingPriority,
}: {
  incident: AiIncident;
  expanded?: boolean;
  onToggle?: () => void;
  onApprove?: (priority: number, command: string) => Promise<void>;
  approvingPriority?: number | null;
}) => {
  const severity = getSeverityStyle(incident.severity);
  const confidence = Math.round(incident.confidence * 100);

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${expanded ? 'ring-1 ring-border' : ''}`}>
      <Button
        type="button"
        variant="ghost"
        className={`h-auto w-full justify-between gap-4 rounded-none border-l-4 p-4 text-left hover:bg-muted/40 sm:p-5 ${severity.border}`}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span className="flex min-w-0 items-start gap-3">
          <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${severity.text}`} />
          <span className="min-w-0">
            <span className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${severity.text}`}>
                {incident.severity} severity
              </span>
              <span className="text-xs text-muted-foreground">Incident analysis</span>
            </span>
            <span className="block truncate font-semibold text-foreground">{incident.problem}</span>
            <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3 w-3" />
              {new Date(incident.createdAt).toLocaleString()}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs font-semibold sm:flex">
            <CircleGauge className={`h-3.5 w-3.5 ${confidence >= 85 ? 'text-emerald-600' : 'text-amber-600'}`} />
            {confidence}% confidence
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </span>
      </Button>
      {expanded &&
        <div className="space-y-5 border-t border-border p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-muted/35 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" /> Root cause
              </p>
              <p className="mt-2 text-sm leading-6">{incident.rootCause}</p>
            </div>
            <div className="rounded-lg bg-muted/35 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Impact</p>
              <p className="mt-2 text-sm leading-6">{incident.impact}</p>
            </div>
            <div className="rounded-lg bg-muted/35 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Confidence</p>
              <p className="mt-2 text-sm font-semibold">{confidence}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                <div className="h-full rounded-full bg-primary" style={{ width: `${confidence}%` }} />
              </div>
            </div>
          </div>


          <div className="border-t border-border pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Recommended actions
              </p>
              <span className="text-xs text-muted-foreground">{incident.recommendations.length} steps</span>
            </div>
            <ol className="space-y-2.5">
              {incident.recommendations
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((recommendation) => (
                  <li
                    key={`${incident.incidentId}-${recommendation.priority}`}
                    className="flex gap-3 rounded-lg border border-border/70 bg-muted/25 p-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {recommendation.priority}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-5">{recommendation.action}</p>
                      {recommendation.command && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs">
                            {recommendation.command}
                          </code>
                          <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {recommendation.execution_status || 'PENDING'}
                          </span>
                          
                          {recommendation.execution_status !== 'COMPLETED' && onApprove && (
                            <Button
                              type="button"
                              size="sm"
                              disabled={approvingPriority === recommendation.priority}
                              onClick={() => onApprove(recommendation.priority, recommendation.command!)}
                            >
                              {approvingPriority === recommendation.priority ? 'Approving...' : 'Approve'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      }
    </div>

  );
};

export default IncidentSummary;