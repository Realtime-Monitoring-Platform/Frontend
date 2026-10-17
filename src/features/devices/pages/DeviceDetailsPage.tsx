import {
  approveAiCommand,
  getAnalyzeBYdEVICEiD,
  updateAiRecommendationStatus,
} from "@/services/AiAnalyze";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Cpu,
  Settings,
  Terminal,
} from "lucide-react";

import DeviceTerminal from "@/components/Deviceterminal";
import DeviceLogs from "./DeviceLogs";
import DeviceMetrics from "./DeviceMetrics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeviceById, getDeviceCommandHistory } from "@/services/deviceAction";
import { AiIncident, DeviceCommand, Pagination as PaginationType } from "@/types";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusStyle } from "@/lib/utils";
import { InfoRow, InfoRowMono, SectionLabel, Spec } from "./utils";
import IncidentSummary from "./IncidentSummary";
//import { Badge } from "@/components/ui/badge";
import { AlertRow, Analysis, Badge, Button, Commands, Logs, StatCard } from "@/Utils/Page";
import { Icon } from "@/Utils/Icon";
import { MiniChart } from "@/Utils/Minichart";

const DeviceDetailsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commandHistoryPage, setCommandHistoryPage] = useState(0);
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const [approvingPriority, setApprovingPriority] = useState<number | null>(null);
  const [approvedRecommendationKeys, setApprovedRecommendationKeys] = useState<
    Set<string>
  >(new Set());
  const queryClient = useQueryClient();

  const { data: deviceDetails, isLoading: deviceLoading } = useQuery({
    queryKey: ["deviceDetails", id],
    queryFn: () => getDeviceById(id || ""),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: commandHistory } = useQuery<PaginationType<DeviceCommand>>({
    queryKey: ["deviceCommandHistory", id, commandHistoryPage],
    queryFn: () => getDeviceCommandHistory(id || "", commandHistoryPage, 10),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  const {
    data: aiAnalysisQuery,
    isLoading: aiAnalysisQueryisLoading,
    error: aiAnalysisQueryError,
  } = useQuery<PaginationType<AiIncident>>({
    queryKey: ["deviceAiAnalysis", id, currentPage, pageSize],
    queryFn: () => getAnalyzeBYdEVICEiD(id || "", currentPage, pageSize),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: Boolean(id),
  });

  const status = getStatusStyle(deviceDetails?.status);
  const incidents = aiAnalysisQuery?.content
    ? [...aiAnalysisQuery.content].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];
  const latestIncident = currentPage === 0 ? incidents[0] : undefined;
  const historyIncidents = currentPage === 0 ? incidents.slice(1) : incidents;

  const approveCommand = async (
    incident: AiIncident,
    priority: number,
    command: string
  ) => {
    const requestedBy = user?.id || user?.userId;
    if (!requestedBy) {
      toast.error("Your user identity is unavailable. Please sign in again.");
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
      if (response.status !== "APPROVED") {
        throw new Error(response.reason || "Command was rejected");
      }
      await updateAiRecommendationStatus({
        incidentId: incident.incidentId,
        priority,
        command,
        status: "APPROVED",
      });
      setApprovedRecommendationKeys((keys) => {
        const next = new Set(keys);
        next.add(`${incident.incidentId}-${priority}`);
        return next;
      });
      toast.success("Command approved and sent to the device service.");
      await queryClient.invalidateQueries({ queryKey: ["deviceAiAnalysis", id] });
    } catch (error) {
      console.error(error);
      toast.error("Command approval failed.");
    } finally {
      setApprovingPriority(null);
    }
  };

  const isOnline =
    status.label.toLowerCase() === "active" ||
    status.label.toLowerCase() === "online";
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Metrics", "Logs", "Alerts", "AI Analysis", "Commands", "Configuration"];
 
  return (


    <div className="space-y-6 pb-8">
      {/* ── Device detail head (EdgePulse style) ─────────────────────── */}
      
      <div className="space-y-4 p-0 ">
        <Link
          to="/devices"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to devices
        </Link>

        <div className="relative overflow-hidden  border border-border bg-card device-detail-head py-5 shadow-sm sm:px-6">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/8 to-transparent" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {deviceLoading
                      ? "Loading…"
                      : deviceDetails?.deviceName || "Device Details"}
                  </h1>
                  <Badge
                    // variant="outline"
                    // className={`gap-1.5 border-transparent font-medium ${status.text}`}
                  >
                    <span className="relative flex h-2 w-2">
                      {isOnline && (
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-60`}
                        />
                      )}
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`}
                      />
                    </span>
                    {status.label}
                  </Badge>
                </div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {deviceDetails?.id?.slice(0, 12) || id || "—"}
                  </code>
                  {deviceDetails?.model && (
                    <>
                      <span>·</span>
                      <span>{deviceDetails.model}</span>
                    </>
                  )}
                  {deviceDetails?.teamName && (
                    <>
                      <span>·</span>
                      <span>{deviceDetails.teamName}ll</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" icon="settings">Edit device</Button><Button icon="command" onClick={()=>{}}>Run command</Button>
            </div>
            
          </div>
              <div className="detail-tabs">{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
  
        </div>
      </div>
     
    {/* <div className="device-detail-head">
      <button className="back-link" onClick={() => {}}>‹ Back to devices</button>
      <div className="device-title-row"><div className="device-hero-icon"><Icon name="device" size={22} /></div><div><div className="title-with-status"><h1>Assembly Controller 12</h1><Badge tone="warning" dot>Warning</Badge><Badge tone="neutral">Demo data</Badge></div><p><code>dev_ac_12f9</code> · NXP i.MX 8M Plus · Factory West</p></div><div className="device-actions"><Button variant="secondary" icon="settings">Edit device</Button><Button icon="command" onClick={() => Navigate("Commands")}>Run command</Button></div></div>
      <div className="detail-tabs">{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
    </div> */}
    {tab === "Overview" || tab === "Metrics" ? <div className="detail-content">
      <div className="detail-stats"><StatCard label="CPU utilization" value="87%" change="+18.2%" icon="cpu" tone="red" data="5 min average" /><StatCard label="Memory usage" value="74%" change="+3.4%" icon="activity" tone="orange" data="2.9 of 4 GB" /><StatCard label="Temperature" value="89.4°C" change="+8.1°C" icon="alert" tone="red" data="critical threshold" /><StatCard label="Disk usage" value="52%" change="+1.2%" icon="device" tone="blue" data="31.2 of 60 GB" /></div>
      <div className="device-overview-grid">
        <section className="card detail-chart"><div className="card-header"><div><h2>System utilization</h2><p>Historical telemetry · last 6 hours</p></div><select><option>Last 6 hours</option><option>Last 24 hours</option></select></div><div className="chart-legend"><span><i className="blue-dot" />CPU</span><span><i className="green-dot" />Memory</span></div><div className="detail-chart-canvas"><MiniChart /><MiniChart color="green" fill={false} /></div></section>
        <section className="card system-info"><div className="card-header"><div><h2>System information</h2><p>Last synchronized just now</p></div></div>{[["Operating system","Yocto Linux 4.0"],["Kernel","6.1.55-rt16"],["Architecture","aarch64"],["Agent version","v1.8.2"],["IP address","10.24.8.112"],["MQTT session","TLS 1.3"]].map(([k,v]) => <div key={k}><span>{k}</span><code>{v}</code></div>)}</section>
        <section className="card recent-events"><div className="card-header"><div><h2>Recent device events</h2><p>Telemetry, alerts, and agent activity</p></div><button className="text-btn" onClick={() => setTab("Logs")}>View logs <Icon name="chevron" size={13} /></button></div><AlertRow severity="Critical" title="CPU temperature threshold exceeded" device="89.4°C observed for 4 minutes" time="2 min ago" /><AlertRow severity="Warning" title="CPU frequency throttled" device="Clock reduced to 1.2 GHz" time="4 min ago" /><AlertRow severity="Info" title="Configuration synchronized" device="Agent revision 1842 applied" time="28 min ago" /></section>
      </div>
    </div> : tab === "Logs" ? <Logs embedded /> : tab === "AI Analysis" ? <Analysis /> : tab === "Commands" ? <Commands /> : <section className="card tab-state"><span><Icon name={tab === "Configuration" ? "settings" : "alert"} size={24} /></span><h2>{tab}</h2><p>Device-specific {tab.toLowerCase()} for <code>dev_ac_12f9</code>.</p><Button variant="secondary">Configure view</Button></section>}
  

      {/* ── Spec strip ──────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-2.5 px-5 py-4">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {isOnline && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-60`}
                  />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.dot}`}
                />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Status
                </p>
                <p className={`mt-0.5 truncate text-sm font-semibold ${status.text}`}>
                  {status.label}
                </p>
              </div>
            </div>
            <div className="flex items-center px-5 py-4 sm:px-4">
              <Spec label="Hostname" value={deviceDetails?.hostname} />
            </div>
            <div className="flex items-center px-5 py-4 sm:px-4">
              <Spec label="IP address" value={deviceDetails?.ipAddress} />
            </div>
            <div className="flex items-center px-5 py-4 sm:px-4">
              <Spec label="MAC address" value={deviceDetails?.macAddress} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="flex flex-col space-y-4">
        <div className="w-full border-b border-border">
          <TabsList className="h-auto w-full justify-start gap-6 overflow-x-auto rounded-none bg-transparent p-0">
            {[
              ["overview", "Overview"],
              ["metrics", "Metrics"],
              ["logs", "Logs"],
              ["commands", "Commands"],
              ["command-history", "Command history"],
              ["ai", "AI Analysis"],
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

        {/* Overview */}
        <TabsContent value="overview" className="mt-0 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Device information</CardTitle>
              <p className="text-sm text-muted-foreground">
                System details synchronized from the device agent
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <SectionLabel>General</SectionLabel>
                    <div className="divide-y divide-border">
                      <InfoRowMono label="Device ID" value={deviceDetails?.id} />
                      <InfoRow label="Device name" value={deviceDetails?.deviceName} />
                      <InfoRow
                        label="Description"
                        value={deviceDetails?.description || "No description"}
                      />
                      <InfoRowMono
                        label="Device identifier"
                        value={deviceDetails?.deviceIdentifier}
                      />
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Hardware</SectionLabel>
                    <div className="divide-y divide-border">
                      <InfoRow
                        label="CPU count"
                        value={deviceDetails?.cpuCount ?? undefined}
                      />
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

                <div className="space-y-6">
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
                      <InfoRowMono
                        label="Kernel version"
                        value={deviceDetails?.kernelVersion}
                      />
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Assignment</SectionLabel>
                    <div className="divide-y divide-border">
                      <InfoRow label="Team" value={deviceDetails?.teamName} />
                      <InfoRow label="Tenant" value={deviceDetails?.tenantName} />
                      <InfoRow
                        label="Assigned user"
                        value={deviceDetails?.assignedUserName || "Unassigned"}
                      />
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Timestamps</SectionLabel>
                    <div className="divide-y divide-border">
                      <InfoRow
                        label="Created"
                        value={
                          deviceDetails?.createdAt
                            ? new Date(deviceDetails.createdAt).toLocaleString()
                            : undefined
                        }
                      />
                      <InfoRow
                        label="Updated"
                        value={
                          deviceDetails?.updatedAt
                            ? new Date(deviceDetails.updatedAt).toLocaleString()
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
<TabsContent value="overview" className="mt-0 space-y-4">
  {/* System utilization */}
  <section className="card detail-chart">
    <div className="card-header">
      <div>
        <h2>System utilization</h2>
        <p>Historical telemetry · last 6 hours</p>
      </div>

      <select
        className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        defaultValue="6h"
      >
        <option value="6h">Last 6 hours</option>
        <option value="24h">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
      </select>
    </div>

    <div className="chart-legend">
      <span>
        <i className="blue-dot" />
        CPU
      </span>
      <span>
        <i className="green-dot" />
        Memory
      </span>
    </div>

    <div className="detail-chart-canvas">
      <div className="min-w-0">
        <p className="mb-2 text-xs text-muted-foreground">CPU usage (%)</p>
        <MiniChart />
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-xs text-muted-foreground">Memory usage (%)</p>
        <MiniChart color="green" fill={false} />
      </div>
    </div>
  </section>

  {/* Device information */}
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-base">Device information</CardTitle>
      <p className="text-sm text-muted-foreground">
        System details synchronized from the device agent
      </p>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <SectionLabel>General</SectionLabel>
            <div className="divide-y divide-border">
              <InfoRowMono label="Device ID" value={deviceDetails?.id} />
              <InfoRow
                label="Device name"
                value={deviceDetails?.deviceName}
              />
              <InfoRow
                label="Description"
                value={deviceDetails?.description || "No description"}
              />
              <InfoRowMono
                label="Device identifier"
                value={deviceDetails?.deviceIdentifier}
              />
            </div>
          </div>

          <div>
            <SectionLabel>Hardware</SectionLabel>
            <div className="divide-y divide-border">
              <InfoRow
                label="CPU count"
                value={deviceDetails?.cpuCount ?? undefined}
              />
              <InfoRow
                label="Total memory"
                value={
                  deviceDetails?.totalMemoryKb
                    ? `${(
                        deviceDetails.totalMemoryKb /
                        1024 /
                        1024
                      ).toFixed(2)} GB`
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionLabel>Network</SectionLabel>
            <div className="divide-y divide-border">
              <InfoRowMono
                label="Hostname"
                value={deviceDetails?.hostname}
              />
              <InfoRowMono
                label="IP address"
                value={deviceDetails?.ipAddress}
              />
              <InfoRowMono
                label="MAC address"
                value={deviceDetails?.macAddress}
              />
            </div>
          </div>

          <div>
            <SectionLabel>Operating system</SectionLabel>
            <div className="divide-y divide-border">
              <InfoRow label="OS name" value={deviceDetails?.osName} />
              <InfoRow
                label="OS version"
                value={deviceDetails?.osVersion}
              />
              <InfoRowMono
                label="Kernel version"
                value={deviceDetails?.kernelVersion}
              />
            </div>
          </div>

          <div>
            <SectionLabel>Assignment</SectionLabel>
            <div className="divide-y divide-border">
              <InfoRow label="Team" value={deviceDetails?.teamName} />
              <InfoRow label="Tenant" value={deviceDetails?.tenantName} />
              <InfoRow
                label="Assigned user"
                value={
                  deviceDetails?.assignedUserName || "Unassigned"
                }
              />
            </div>
          </div>

          <div>
            <SectionLabel>Timestamps</SectionLabel>
            <div className="divide-y divide-border">
              <InfoRow
                label="Created"
                value={
                  deviceDetails?.createdAt
                    ? new Date(deviceDetails.createdAt).toLocaleString()
                    : undefined
                }
              />
              <InfoRow
                label="Updated"
                value={
                  deviceDetails?.updatedAt
                    ? new Date(deviceDetails.updatedAt).toLocaleString()
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

        {/* Metrics */}
        <TabsContent value="metrics" className="mt-0">
          {id && <DeviceMetrics id={id} />}
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="mt-0">
          <Card className="overflow-hidden border-border/80">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" />
                Live device logs
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Streaming structured logs from the connected agent
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {id && <DeviceLogs deviceId={id} />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commands */}
        <TabsContent value="commands" className="mt-0" id="commands">
          <Card>
            <CardHeader className="border-b border-border/70">
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="h-4 w-4 text-primary" />
                Command terminal
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Run approved, auditable operations on this device
              </p>
            </CardHeader>
            <CardContent className="pt-5">
              <DeviceTerminal
                deviceId={id}
                tenantId={deviceDetails?.tenantId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Command history */}
        <TabsContent value="command-history" className="mt-0">
          <Card>
            <CardHeader className="border-b border-border/70">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="h-4 w-4 text-primary" />
                Command history
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Chronological record of commands sent to this device
              </p>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-2.5">
                {commandHistory?.content?.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No commands have been recorded for this device.
                  </p>
                ) : (
                  commandHistory?.content?.map((command) => (
                    <div
                      key={command.id}
                      className="rounded-lg border border-border bg-muted/20 p-3.5 text-sm transition-colors hover:bg-muted/35"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <code className="font-mono text-[13px]">
                          {command.command}
                        </code>
                        <Badge
                          variant="outline"
                          className={
                            command.status === "COMPLETED" ||
                            command.status === "SUCCESS"
                              ? "border-emerald-500/30 text-emerald-600"
                              : command.status === "FAILED"
                                ? "border-red-500/30 text-red-600"
                                : ""
                          }
                        >
                          {command.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          {command.userId ||
                            (command.aiGenerated ? "AI generated" : "Unknown")}
                        </span>
                        <span>
                          {command.aiGenerated ? "AI approved" : "User command"}
                        </span>
                        <span>
                          {new Date(command.createdAt).toLocaleString()}
                        </span>
                        {command.exitCode !== null && (
                          <span>exit {command.exitCode}</span>
                        )}
                      </div>
                      {command.stdout && (
                        <pre className="mt-2.5 overflow-x-auto whitespace-pre-wrap rounded-md border border-border/60 bg-background p-2.5 font-mono text-xs leading-relaxed">
                          {command.stdout}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>

              {commandHistory && commandHistory.totalPages > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4">
                  <Button
                    type="button"
                  //  variant="outline"
                    size="sm"
                    disabled={commandHistory.first}
                    onClick={() => setCommandHistoryPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {commandHistory.number + 1} of{" "}
                    {commandHistory.totalPages}
                  </span>
                  <Button
                    type="button"
                    // variant="outline"
                    size="sm"
                    disabled={commandHistory.last}
                    onClick={() => setCommandHistoryPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis */}
        <TabsContent value="ai" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bot className="h-4 w-4 text-primary" />
                  AI incident analysis
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Evidence-backed diagnostic hypotheses for this device
                </p>
              </div>
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page" className="text-xs">
                  Rows
                </FieldLabel>
                <Select
                  defaultValue="10"
                  onValueChange={(value) => {
                    setPageSize(parseInt(value, 10));
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="h-8 w-16" id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      {["1", "10", "25", "50", "100"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </CardHeader>

            <CardContent className="pt-5">
              {aiAnalysisQueryisLoading && (
                <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  Analyzing device history…
                </div>
              )}

              {aiAnalysisQueryError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Couldn&apos;t load AI analysis for this device. Try
                    refreshing the page.
                  </AlertDescription>
                </Alert>
              )}

              {!aiAnalysisQueryisLoading &&
                !aiAnalysisQueryError &&
                aiAnalysisQuery?.content?.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    <p className="text-sm font-medium">No incidents detected</p>
                    <p className="text-sm text-muted-foreground">
                      This device is behaving normally.
                    </p>
                  </div>
                )}

              {!aiAnalysisQueryisLoading &&
                !aiAnalysisQueryError &&
                aiAnalysisQuery?.content &&
                aiAnalysisQuery.content.length > 0 && (
                  <div className="space-y-6">
                    {latestIncident && (
                      <section
                        aria-labelledby="latest-analysis-heading"
                        className="space-y-2.5"
                      >
                        <h2
                          id="latest-analysis-heading"
                          className="text-sm font-semibold text-foreground"
                        >
                          Latest analysis
                        </h2>
                        <IncidentSummary
                          expanded={
                            expandedIncidentId === latestIncident.incidentId
                          }
                          onToggle={() =>
                            setExpandedIncidentId((current) =>
                              current === latestIncident.incidentId
                                ? null
                                : latestIncident.incidentId
                            )
                          }
                          onApprove={(priority, command) =>
                            approveCommand(latestIncident, priority, command)
                          }
                          approvingPriority={approvingPriority}
                          approvedKeys={approvedRecommendationKeys}
                          incident={latestIncident}
                        />
                      </section>
                    )}

                    {historyIncidents.length > 0 && (
                      <section
                        aria-labelledby="analysis-history-heading"
                        className="space-y-2.5"
                      >
                        <h2
                          id="analysis-history-heading"
                          className="text-sm font-semibold text-foreground"
                        >
                          Earlier analyses
                        </h2>
                        <div className="space-y-2.5">
                          {historyIncidents.map((incident) => (
                            <IncidentSummary
                              key={incident.incidentId}
                              incident={incident}
                              expanded={
                                expandedIncidentId === incident.incidentId
                              }
                              onToggle={() =>
                                setExpandedIncidentId((current) =>
                                  current === incident.incidentId
                                    ? null
                                    : incident.incidentId
                                )
                              }
                              onApprove={(priority, command) =>
                                approveCommand(incident, priority, command)
                              }
                              approvingPriority={approvingPriority}
                              approvedKeys={approvedRecommendationKeys}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {aiAnalysisQuery.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1.5 border-t border-border pt-4">
                        <Button
                          type="button"
                        //  variant="outline"
                          size="sm"
                          disabled={aiAnalysisQuery.first}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Previous
                        </Button>
                        {Array.from(
                          { length: aiAnalysisQuery.totalPages },
                          (_, i) => i
                        ).map((page) => (
                          <Button
                            key={page}
                            type="button"
                            size="sm"
                            // variant={
                            //   aiAnalysisQuery.number === page
                            //     ? "default"
                            //     : "outline"
                            // }
                            onClick={() => setCurrentPage(page)}
                            className="min-w-8"
                          >
                            {page + 1}
                          </Button>
                        ))}
                        <Button
                          type="button"
                          // variant="outline"
                          size="sm"
                          disabled={aiAnalysisQuery.last}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetailsPage;