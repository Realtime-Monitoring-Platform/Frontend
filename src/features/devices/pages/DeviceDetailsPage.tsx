import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import DeviceTerminal from '@/components/Deviceterminal';
import DeviceLogs from './DeviceLogs';
import DeviceMetrics from './DeviceMetrics';
import { useQuery } from '@tanstack/react-query';
import { getDeviceById } from '@/services/deviceAction';
import { getAnalyzeBYdEVICEiD } from '@/services/AiAnalyze';
import { AiIncident } from '@/types';



const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  ACTIVE: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Active' },
  ONLINE: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Online' },
  INACTIVE: { dot: 'bg-slate-400', text: 'text-slate-600', label: 'Inactive' },
  OFFLINE: { dot: 'bg-slate-400', text: 'text-slate-600', label: 'Offline' },
  ERROR: { dot: 'bg-red-500', text: 'text-red-700', label: 'Error' },
  DEGRADED: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Degraded' },
};

const getStatusStyle = (status?: string) =>
  STATUS_STYLES[(status || '').toUpperCase()] ?? {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    label: status || 'Unknown',
  };

const SEVERITY_STYLES: Record<string, { border: string; dot: string; text: string }> = {
  CRITICAL: { border: 'border-l-red-500', dot: 'bg-red-500', text: 'text-red-700' },
  HIGH: { border: 'border-l-orange-500', dot: 'bg-orange-500', text: 'text-orange-700' },
  MEDIUM: { border: 'border-l-amber-500', dot: 'bg-amber-500', text: 'text-amber-700' },
  LOW: { border: 'border-l-slate-400', dot: 'bg-slate-400', text: 'text-slate-600' },
};

const getSeverityStyle = (severity: string) =>
  SEVERITY_STYLES[severity.toUpperCase()] ?? SEVERITY_STYLES.LOW;


const Spec = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="min-w-0">
    <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
    <p className="mt-0.5 truncate font-mono text-sm text-foreground">{value || '—'}</p>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="truncate text-right font-medium">{value ?? 'N/A'}</span>
  </div>
);

const InfoRowMono = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="truncate text-right font-mono text-[13px]">{value || 'N/A'}</span>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-1 text-sm font-semibold text-foreground">{children}</h3>
);


const DeviceDetailsPage = () => {
  const { id } = useParams();
  const { data: deviceDetails } = useQuery({
    queryKey: ['deviceDetails', id],
    queryFn: () => getDeviceById(id || ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const aiAnalysisQuery = useQuery<AiIncident[]>({
    queryKey: ['deviceAiAnalysis', id],
    queryFn: () => getAnalyzeBYdEVICEiD(id || ''),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });

  const status = getStatusStyle(deviceDetails?.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {deviceDetails?.deviceName || 'Device Details'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {deviceDetails?.model || 'No model specified'}
          </p>
        </div>
        <div className="flex gap-2">
          {/*
          <Button variant="outline" onClick={() => navigate(`/devices/${id}/edit`)}>
            Edit
          </Button>
          <Button onClick={() => navigate(`/devices/${id}/commands`)}>
            Send Command
          </Button>
          */}
        </div>
      </div>

      {/* Spec strip — one bordered row, divided columns, instead of four
          identical colored icon cards. Status leads with a live dot since
          that's the one field people scan for first. */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
            <div className="flex items-center gap-2.5 pb-3 pr-4 sm:pb-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {status.label.toLowerCase() === 'active' || status.label.toLowerCase() === 'online' ? (
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-60`} />
                ) : null}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.dot}`} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground">Status</p>
                <p className={`mt-0.5 truncate text-sm font-semibold ${status.text}`}>{status.label}</p>
              </div>
            </div>
            <div className="px-0 pb-3 pt-3 sm:px-4 sm:py-0">
              <Spec label="Hostname" value={deviceDetails?.hostname} />
            </div>
            <div className="px-0 pb-3 pt-3 sm:px-4 sm:py-0">
              <Spec label="IP address" value={deviceDetails?.ipAddress} />
            </div>
            <div className="px-0 pt-3 sm:px-4 sm:py-0">
              <Spec label="MAC address" value={deviceDetails?.macAddress} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs — underline indicator rather than a pill background, so the
          active tab reads as a state change, not a separate button shape. */}
      <Tabs defaultValue="overview" className="flex flex-col space-y-4">
        <div className="w-full border-b border-border">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
            {[
              ['overview', 'Overview'],
              ['metrics', 'Metrics'],
              ['logs', 'Logs'],
              ['commands', 'Commands'],
              ['configuration', 'Configuration'],
              ['ai', 'AI Analysis'],
            ].map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none border-b-2 border-transparent bg-transparent px-0.5 pb-3 text-sm text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Device information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
                  {/* Left column */}
                  <div className="space-y-5">
                    <div>
                      <SectionLabel>General</SectionLabel>
                      <div className="divide-y divide-border">
                        <InfoRowMono label="Device ID" value={deviceDetails?.id} />
                        <InfoRow label="Device name" value={deviceDetails?.deviceName} />
                        <InfoRow label="Description" value={deviceDetails?.description || 'No description'} />
                        <InfoRow label="Location" value={deviceDetails?.location} />
                        <InfoRowMono label="Device identifier" value={deviceDetails?.deviceIdentifier} />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Hardware</SectionLabel>
                      <div className="divide-y divide-border">
                        <InfoRow label="Manufacturer" value={deviceDetails?.manufacturer} />
                        <InfoRow label="Model" value={deviceDetails?.model} />
                        <InfoRow label="CPU count" value={deviceDetails?.cpuCount ?? undefined} />
                        <InfoRow
                          label="Total memory"
                          value={
                            deviceDetails?.totalMemoryKb
                              ? `${(deviceDetails.totalMemoryKb / 1024 / 1024).toFixed(2)} GB`
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-5">
                    <div>
                      <SectionLabel>Network</SectionLabel>
                      <div className="divide-y divide-border">
                        <InfoRowMono label="Hostname" value={deviceDetails?.hostname} />
                        <InfoRowMono label="IP address" value={deviceDetails?.ipAddress} />
                        <InfoRowMono label="MAC address" value={deviceDetails?.macAddress} />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Operating system</SectionLabel>
                      <div className="divide-y divide-border">
                        <InfoRow label="OS name" value={deviceDetails?.osName} />
                        <InfoRow label="OS version" value={deviceDetails?.osVersion} />
                        <InfoRowMono label="Kernel version" value={deviceDetails?.kernelVersion} />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Assignment</SectionLabel>
                      <div className="divide-y divide-border">
                        <InfoRow label="Team" value={deviceDetails?.teamName} />
                        <InfoRow label="Tenant" value={deviceDetails?.tenantName} />
                        <InfoRow label="Assigned user" value={deviceDetails?.assignedUserName || 'Unassigned'} />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Timestamps</SectionLabel>
                      <div className="divide-y divide-border">
                        <InfoRow
                          label="Last seen"
                          value={deviceDetails?.lastSeen ? new Date(deviceDetails.lastSeen).toLocaleString() : 'Never'}
                        />
                        <InfoRow
                          label="Created"
                          value={deviceDetails?.createdAt ? new Date(deviceDetails.createdAt).toLocaleString() : undefined}
                        />
                        <InfoRow
                          label="Updated"
                          value={deviceDetails?.updatedAt ? new Date(deviceDetails.updatedAt).toLocaleString() : undefined}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">{id && <DeviceMetrics id={id} />}</TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Device logs</CardTitle>
              </CardHeader>
              <CardContent>{id && <DeviceLogs deviceId={id} />}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Command history</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <DeviceTerminal deviceId={id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>Device configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configuration editing isn't available yet for this device.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysisQuery.isLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="h-4 w-4" />
                    Analyzing device history…
                  </div>
                )}

                {aiAnalysisQuery.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Couldn't load AI analysis for this device. Try refreshing the page.
                    </AlertDescription>
                  </Alert>
                )}

                {!aiAnalysisQuery.isLoading && !aiAnalysisQuery.isError && aiAnalysisQuery.data?.length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    No incidents detected — this device is behaving normally.
                  </div>
                )}

                {!aiAnalysisQuery.isLoading &&
                  !aiAnalysisQuery.isError &&
                  aiAnalysisQuery.data &&
                  aiAnalysisQuery.data.length > 0 && (
                    <div className="space-y-4">
                      {aiAnalysisQuery.data.map((incident) => {
                        const severity = getSeverityStyle(incident.severity);
                        return (
                          <div
                            key={incident.incidentId}
                            className={`space-y-4 rounded-md border border-l-4 ${severity.border} bg-card p-4`}
                          >
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${severity.text}`} />
                                <div>
                                  <h3 className="font-semibold leading-snug">{incident.problem}</h3>
                                  <p className="text-xs text-muted-foreground">
                                    Detected {new Date(incident.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <span className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${severity.text}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} />
                                {incident.severity}
                              </span>
                            </div>

                            <div className="grid gap-4 border-t border-border pt-3 md:grid-cols-3">
                              <div>
                                <p className="text-[11px] font-medium text-muted-foreground">Root cause</p>
                                <p className="mt-1 text-sm">{incident.rootCause}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-medium text-muted-foreground">Impact</p>
                                <p className="mt-1 text-sm">{incident.impact}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-medium text-muted-foreground">Confidence</p>
                                <p className="mt-1 text-sm font-semibold">
                                  {Math.round(incident.confidence * 100)}%
                                </p>
                              </div>
                            </div>

                            <div className="border-t border-border pt-3">
                              <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                                Recommended actions, in order
                              </p>
                              <ol className="space-y-2">
                                {incident.recommendations
                                  .slice()
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((recommendation) => (
                                    <li
                                      key={`${incident.incidentId}-${recommendation.priority}`}
                                      className="flex gap-3 rounded-md bg-muted/40 p-3"
                                    >
                                      <span className="mt-0.5 shrink-0 text-sm font-semibold text-muted-foreground">
                                        {recommendation.priority}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">{recommendation.action}</p>
                                        {recommendation.command && (
                                          <code className="mt-2 block overflow-x-auto rounded bg-background px-2 py-1 font-mono text-xs">
                                            {recommendation.command}
                                          </code>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                              </ol>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DeviceDetailsPage;