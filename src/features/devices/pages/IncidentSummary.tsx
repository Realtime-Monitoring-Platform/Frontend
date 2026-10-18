import { Button } from "@/components/ui/button";
import { getSeverityStyle } from "@/lib/utils";
import { AiIncident } from "@/types";
import { Badge } from "@/Utils/Badge";
import { Icon } from "@/Utils/Icon";
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
    <div className="analysis-detail-content">
      <div className="analysis-title">
        <div>
          <Badge
            tone={
              incident.severity.toUpperCase() === "HIGH"
                ? "danger"
                : incident.severity.toUpperCase() === "MEDIUM"
                  ? "warning"
                  : "neutral"
            }
          >
            {incident.severity} severity
          </Badge>

          <h2>{incident.problem}</h2>

          <p>
            <code>{incident.deviceId}</code>
            {" · "}
            Analyzed{" "}
            {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        <span className="analysis-confidence-badge">
          {confidence}% confidence
        </span>
      </div>

      <div className="ai-disclaimer">
        <Icon name="ai" size={18} />

        <div>
          <b>AI-generated hypothesis</b>
          <p>
            This analysis identifies a possible cause based on
            available telemetry and logs. Validate the evidence
            before taking action.
          </p>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Incident summary</h3>
        <p>{incident.rootCause || incident.problem}</p>
      </div>

      <div className="evidence-grid">
        <div>
          <h3>Incident impact</h3>
          <p>{incident.impact || "No impact details available."}</p>
        </div>

        <div>
          <h3>Evidence confidence</h3>

          <div className="confidence">
            <span>
              <i style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }} />
            </span>
            <b>{confidence}%</b>
          </div>

          <p>Confidence score returned by the AI analysis service.</p>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Recommended troubleshooting steps</h3>

        {incident.recommendations.length > 0 ? (
          <ol>
            {incident.recommendations
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((recommendation) => (
                <li key={`${incident.incidentId}-${recommendation.priority}`}>
                  <span>{recommendation.priority}</span>

                  <div>
                    <b>{recommendation.action}</b>

                    {recommendation.command && (
                      <div className="recommendation-command">
                        <code>{recommendation.command}</code>

                        <Badge tone="neutral">
                          {recommendation.execution_status || "PENDING"}
                        </Badge>

                        {/* Keep your existing approval handler here if needed. */}
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        ) : (
          <p>No recommendations available for this incident.</p>
        )}
      </div>
    </div>
  );

};

export default IncidentSummary;