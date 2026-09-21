import { approveAiCommand, getAnalyzeBYdEVICEiD, updateAiRecommendationStatus } from '@/services/AiAnalyze';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Bot, CheckCircle2, Clock3, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceTerminal from '@/components/Deviceterminal';
import DeviceLogs from './DeviceLogs';
import DeviceMetrics from './DeviceMetrics';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeviceById, getDeviceCommandHistory } from '@/services/deviceAction';

import { AiIncident, DeviceCommand, Pagination as PaginationType } from '@/types';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getStatusStyle } from '@/lib/utils';
import { InfoRow, InfoRowMono, SectionLabel, Spec } from './utils';
import IncidentSummary from './IncidentSummary';






const DeviceDetailsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commandHistoryPage, setCommandHistoryPage] = useState(0);
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const [approvingPriority, setApprovingPriority] = useState<number | null>(null);
  const [approvedRecommendationKeys, setApprovedRecommendationKeys] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { data: deviceDetails } = useQuery({
    queryKey: ['deviceDetails', id],
    queryFn: () => getDeviceById(id || ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  const { data: commandHistory } = useQuery<PaginationType<DeviceCommand>>({
    queryKey: ['deviceCommandHistory', id, commandHistoryPage],
    queryFn: () => getDeviceCommandHistory(id || '', commandHistoryPage, 10),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  // const aiAnalysisQuery = useQuery<PaginationType<AiIncident>>({
  //   queryKey: ['deviceAiAnalysis', id],
  //   queryFn: () => { return getAnalyzeBYdEVICEiD(id || '', currentPage, pageSize); },
  //   enabled: Boolean(id),
  //   staleTime: 60 * 1000,
  // });
  const { data: aiAnalysisQuery, isLoading: aiAnalysisQueryisLoading, error: aiAnalysisQueryError } = useQuery<PaginationType<AiIncident>>({
    queryKey: ["deviceAiAnalysis", id, currentPage, pageSize],
    queryFn: () => { return getAnalyzeBYdEVICEiD(id || '', currentPage, pageSize); },

    staleTime: 0,
    refetchOnMount: "always",
    enabled: Boolean(id),
  });
  const status = getStatusStyle(deviceDetails?.status);
  const incidents = aiAnalysisQuery?.content
    ? [...aiAnalysisQuery.content].sort(
      (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    )
    : [];
  const latestIncident = currentPage === 0 ? incidents[0] : undefined;
  const historyIncidents = currentPage === 0 ? incidents.slice(1) : incidents;
    const approveCommand = async (incident: AiIncident, priority: number, command: string) => {
      const requestedBy = user?.id || user?.userId;
      if (!requestedBy) {
        toast.error('Your user identity is unavailable. Please sign in again.');
        return;
      }

      setApprovingPriority(priority);
      try {
        const response = await approveAiCommand({
          incidentId: incident.incidentId,
          deviceId: incident.deviceId,
          tenantId: incident.tenantId,
          recommendationPriority: priority,
          command,
          requestedBy,
        });
        if (response.status !== 'APPROVED') {
          throw new Error(response.reason || 'Command was rejected');
        }
        await updateAiRecommendationStatus({
          incidentId: incident.incidentId,
          priority,
          command,
          status: 'APPROVED',
        });
        setApprovedRecommendationKeys((currentKeys) => {
          const nextKeys = new Set(currentKeys);
          nextKeys.add(`${incident.incidentId}-${priority}`);
          return nextKeys;
        });
        toast.success('Command approved and sent to the device service.');
        await queryClient.invalidateQueries({ queryKey: ['deviceAiAnalysis', id] });
      } catch(error) {
        console.error(error);
        toast.error('Command approval failed.');
      } finally {
        setApprovingPriority(null);
      }
    };
  console.log("incidents:", incidents);
  return (
    <div className="space-y-6 pb-8">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card px-5 py-6 shadow-sm sm:px-7">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Device monitoring
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
            {deviceDetails?.deviceName || 'Device Details'}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
            {deviceDetails?.model || 'No model specified'}
              </p>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div className="rounded-lg border border-border/80 bg-background/70 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Device ID</p>
              <p className="mt-1 max-w-[190px] truncate font-mono text-xs">{deviceDetails?.id || '—'}</p>
            </div>
            <div className="rounded-lg border border-border/80 bg-background/70 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Last seen</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                {deviceDetails?.lastSeen ? new Date(deviceDetails.lastSeen).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spec strip — one bordered row, divided columns, instead of four
          identical colored icon cards. Status leads with a live dot since
          that's the one field people scan for first. */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
            <div className="flex items-center gap-2.5 px-5 py-4">
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
            <div className="px-5 py-4 sm:px-4 sm:py-0">
              <Spec label="Hostname" value={deviceDetails?.hostname} />
            </div>
            <div className="px-5 py-4 sm:px-4 sm:py-0">
              <Spec label="IP address" value={deviceDetails?.ipAddress} />
            </div>
            <div className="px-5 py-4 sm:px-4 sm:py-0">
              <Spec label="MAC address" value={deviceDetails?.macAddress} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs — underline indicator rather than a pill background, so the
          active tab reads as a state change, not a separate button shape. */}
      <Tabs defaultValue="overview" className="flex flex-col space-y-4">
        <div className="w-full border-b border-border">
          <TabsList className="h-auto w-full justify-start gap-6 overflow-x-auto rounded-none bg-transparent p-0">
            {[
              ['overview', 'Overview'],
              ['metrics', 'Metrics'],
              ['logs', 'Logs'],
              ['commands', 'Commands'],
              ['command-history', 'Command history'],
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
                <CardTitle className="flex items-center gap-2"><Terminal className="h-4 w-4 text-primary" />Command terminal</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <DeviceTerminal deviceId={id} tenantId={deviceDetails?.tenantId} />
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="command-history">
            <Card className="mb-4">
              <CardHeader className="border-b border-border/70">
                <CardTitle className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />Command history</CardTitle>
                <p className="text-sm text-muted-foreground">A chronological record of commands sent to this device.</p>
              </CardHeader>
              <CardContent className="w-full">
                <div className="mb-6 space-y-2">
                  {commandHistory?.content?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No commands have been recorded for this device.</p>
                  ) : (
                    commandHistory?.content?.map((command) => (
                      <div key={command.id} className="rounded-md border border-border p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <code className="font-mono">{command.command}</code>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {command.status}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>User ID: {command.userId || (command.aiGenerated ? 'AI generated' : 'Unknown')}</span>
                          <span>{command.aiGenerated ? 'AI approved' : 'User command'}</span>
                          <span>{new Date(command.createdAt).toLocaleString()}</span>
                          {command.exitCode !== null && <span>exit {command.exitCode}</span>}
                        </div>
                        {command.stdout && (
                          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-muted/40 p-2 text-xs">
                            {command.stdout}
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {commandHistory && commandHistory.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 border-t border-border pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={commandHistory.first}
                      onClick={() => setCommandHistoryPage((page) => page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {commandHistory.number + 1} of {commandHistory.totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={commandHistory.last}
                      onClick={() => setCommandHistoryPage((page) => page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="ai">
            <Card>
              <CardHeader className="flex flex-row items-center
               justify-between">

                <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4 text-primary" />AI analysis</CardTitle>
                <div className="flex  items-center justify-between gap-4">
                  <Field orientation="horizontal" className="w-fit">
                    <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                    <Select defaultValue="10" onValueChange={(value) => {
                      setPageSize(parseInt(value, 10));
                      setCurrentPage(0); // Reset to first page when page size changes
                    }}>
                      <SelectTrigger className="w-20" id="select-rows-per-page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectGroup>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                </div>
              </CardHeader>


              <CardContent>
                {aiAnalysisQueryisLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="h-4 w-4" />
                    Analyzing device history…
                  </div>
                )}

                {aiAnalysisQueryError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Couldn't load AI analysis for this device. Try refreshing the page.
                    </AlertDescription>
                  </Alert>
                )}

                {!aiAnalysisQueryisLoading &&
                  !aiAnalysisQueryError &&
                  aiAnalysisQuery?.content?.length === 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      No incidents detected — this device is behaving normally.
                    </div>
                  )}

                {!aiAnalysisQueryisLoading &&
                  !aiAnalysisQueryError &&
                  aiAnalysisQuery?.content &&
                  aiAnalysisQuery.content.length > 0 && (
                    <div className="space-y-4">
                      {/* {latestIncident && (
                        <section aria-labelledby="latest-analysis-heading" className="space-y-2">
                          <h2 id="latest-analysis-heading" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            Latest analysis
                          </h2>
                          <IncidentSummary
                            expanded={expandedIncidentId === latestIncident.incidentId}
                            onToggle={() => setExpandedIncidentId((currentId) =>
                              currentId === latestIncident.incidentId ? null : latestIncident.incidentId,
                            )}
                            onApprove={(priority, command) => approveCommand(latestIncident, priority, command)}
                            approvingPriority={approvingPriority}
                            approvedRecommendationKeys={approvedRecommendationKeys}
                            incident={latestIncident} />
                        </section>
                      )} */}

                      {/* {historyIncidents.length > 0 && (
                        <section aria-labelledby="analysis-history-heading" className="space-y-2">
                          <h2 id="analysis-history-heading" className="text-sm font-semibold text-foreground">
                            Earlier analyses
                          </h2>
                          <div className="space-y-2">
                            {historyIncidents.map((incident) => (
                              <IncidentSummary
                                key={incident.incidentId}
                                incident={incident}
                                expanded={expandedIncidentId === incident.incidentId}
                                onToggle={() => setExpandedIncidentId((currentId) =>
                                  currentId === incident.incidentId ? null : incident.incidentId,
                                )}
                                onApprove={(priority, command) => approveCommand(incident, priority, command)}
                                approvingPriority={approvingPriority}
                                approvedRecommendationKeys={approvedRecommendationKeys}
                              />
                            ))}
                          </div>
                        </section>
                      )} */}

                      {/* Pagination */}
                      {aiAnalysisQuery.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 border-t border-border pt-4">
                          <button
                            type="button"
                            disabled={aiAnalysisQuery.first}
                            onClick={() =>
                              setCurrentPage((page) => page - 1)
                            }
                            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Previous
                          </button>

                          {Array.from(
                            { length: aiAnalysisQuery.totalPages },
                            (_, index) => index
                          ).map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`rounded-md border px-3 py-1.5 text-sm ${aiAnalysisQuery.number === page
                                ? "bg-primary text-primary-foreground"
                                : ""
                                }`}
                            >
                              {page + 1}
                            </button>
                          ))}

                          <button
                            type="button"
                            disabled={aiAnalysisQuery.last}
                            onClick={() =>
                              setCurrentPage((page) => page + 1)
                            }
                            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
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