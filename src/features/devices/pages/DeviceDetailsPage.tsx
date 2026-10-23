import {
  approveAiCommand,
  getAnalyzeBYdEVICEiD,
  updateAiRecommendationStatus,
} from "@/services/AiAnalyze";
import ReactECharts from "echarts-for-react";

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
  ExternalLink,
  Settings,
  Terminal,
} from "lucide-react";

import DeviceTerminal from "@/components/Deviceterminal";
import DeviceLogs from "./DeviceLogs";
import DeviceMetrics from "./DeviceMetrics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeviceById, getDeviceCommandHistory, fetchLatestDeviceMetrics, fetchDeviceMetrics } from "@/services/deviceAction";
import { AiIncident, DeviceCommand, MetricsSnapshot, Pagination as PaginationType } from "@/types";
import { useMemo, useState } from "react";
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
import { getSeverityStyle, getStatusStyle } from "@/lib/utils";
import { InfoRow, InfoRowMono, SectionLabel, Spec } from "./utils";
import IncidentSummary from "./IncidentSummary";
//import { Badge } from "@/components/ui/badge";
import { AlertRow, Analysis, Badge, Button, Commands, Logs, PageHeading, StatCard } from "@/Utils/Page";
import { Icon } from "@/Utils/Icon";
import { MiniChart } from "@/Utils/Minichart";
import { Button as ShadecnButton } from "@/components/ui/button";
import { buildTrendOption } from "@/Utils";
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

  const { data: latestMetrics } = useQuery<MetricsSnapshot | null>({
    queryKey: ["deviceLatestMetrics", id],
    queryFn: () => fetchLatestDeviceMetrics(id || ""),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  const latestMetricPoint = latestMetrics;
  const cpuValue = latestMetricPoint?.cpu ?? 0;
  const ramValue = latestMetricPoint?.ram ?? 0;
  const memory = latestMetricPoint?.memory;
  const memoryUsedGb = memory?.used_kb !== undefined ? (memory.used_kb / 1024 / 1024).toFixed(1) : "—";
  const memoryTotalGb = memory?.total_kb !== undefined ? (memory.total_kb / 1024 / 1024).toFixed(1) : "—";
  const disk = latestMetricPoint?.disks?.[0];
  const diskPercent = disk?.used_percent ?? 0;
  const diskUsedGb = disk?.used_bytes !== undefined ? (disk.used_bytes / 1024 / 1024 / 1024).toFixed(1) : "—";
  const diskTotalGb = disk?.total_bytes !== undefined ? (disk.total_bytes / 1024 / 1024 / 1024).toFixed(1) : "—";
  const diskTone = diskPercent >= 90 ? "red" : diskPercent >= 75 ? "orange" : "blue";
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
  const { id: deviceId } = useParams()
  const timeRange = "-7d";
  const {
    data: metrics = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deviceMetrics", deviceId, timeRange],
    queryFn: () => fetchDeviceMetrics(deviceId || "", timeRange),
    enabled: Boolean(deviceId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  if (metrics) {
    console.log(metrics)
  }



  const latest = metrics.at(-1);
  const trendOption = useMemo(
    () => buildTrendOption(metrics),
    [metrics]
  );

  const isOnline =
    status.label.toLowerCase() === "active" ||
    status.label.toLowerCase() === "online";

  // Delta between the two most recent samples of the metrics history.
  const previousMetric = metrics.length > 1 ? metrics[metrics.length - 2] : undefined;
  const formatDelta = (current?: number, previous?: number, unit = "%") => {
    if (typeof current !== "number" || typeof previous !== "number") return "—";
    const delta = current - previous;
    return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}${unit}`;
  };
  console.log(deviceId)
  const { data: snapshot } = useQuery<MetricsSnapshot | null>({
    queryKey: ["deviceMetricsSnapshot", deviceId, timeRange],
    queryFn: () => fetchLatestDeviceMetrics(deviceId || "", timeRange),
    enabled: Boolean(deviceId),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
  const formatGB = (bytes?: number | null): string => {
    if (bytes == null || !Number.isFinite(bytes)) return "—";
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const getPercentage = (
    used?: number | null,
    total?: number | null
  ): number => {
    if (
      used == null ||
      total == null ||
      !Number.isFinite(used) ||
      !Number.isFinite(total) ||
      total <= 0
    ) {
      return 0;
    }

    return Math.min(100, Math.max(0, (used / total) * 100));
  };
  console.log("snapshot", snapshot)
  const hasMetrics = Boolean(latestMetricPoint);
  console.log(metrics)
  const detailStats = (
    <div className="detail-stats">
      <StatCard
        label="CPU utilization"
        value={`${(snapshot?.cpu)?.toFixed(2)} %`}
      change={formatDelta(latest?.cpu, previousMetric?.cpu)}
      icon="cpu"
      tone={cpuValue >= 90 ? "red" : cpuValue >= 70 ? "orange" : "blue"}
      data="live from device"
      />
      <StatCard
        label="Memory usage"
        value={`${getPercentage(
          snapshot?.memory?.used_kb,
          snapshot?.memory?.total_kb
        ).toFixed(1)} %`}
      change={formatDelta(latest?.ram, previousMetric?.ram)}
      icon="activity"
      tone={ramValue >= 90 ? "red" : ramValue >= 70 ? "orange" : "green"}
      data={snapshot?.memory?.total_kb !== undefined ? `${formatGB(snapshot?.memory?.used_kb)} of ${formatGB(snapshot?.memory?.total_kb)}` : "live from device"}
      />
      <StatCard
        label="Temperature"
        value="N/A"
        change="—"
        icon="alert"
        tone="neutral"
        data="not reported by agent"
      />
      <StatCard
        label="Disk usage"
        value={`${getPercentage(
          snapshot?.disks?.[0]?.used_bytes,
          snapshot?.disks?.[0]?.total_bytes
        ).toFixed(1)} %`}
        change="—"
        icon="device"
        tone={diskTone}
        data={snapshot?.disks?.[0]?.used_bytes !== undefined ? `${formatGB(snapshot?.disks?.[0]?.used_bytes)} of ${formatGB(snapshot?.disks?.[0]?.total_bytes)}` : "no disk reported" }
      />
    </div>
  );

  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Metrics", "Logs", "AI Analysis", "Commands", "Command History"];
  console.log(metrics)
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

        <div className="relative overflow-hidden    bg-card device-detail-head py-5 shadow-sm sm:px-6">
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
              <Button variant="secondary" icon="settings">Edit device</Button><Button icon="command" onClick={() => {
                setTab("Commands");
              }}>Run command</Button>
            </div>

          </div>
          <div className="detail-tabs">{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>

        </div>

      </div>

      <div className="detail-content">
        <Tabs defaultValue="Overview" value={tab} onValueChange={setTab} className="w-full flex flex-col space-y-4">

          <TabsContent value="Overview" className="mt-4">
            <div className="detail-content">
              {detailStats}

              <div className="device-overview-grid w-full">
                <section className="card w-full ">

                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>
                      Real-time Metrics{" "}
                      <span className="text-muted-foreground">
                        (Last {timeRange.replace("-", "")})
                      </span>
                    </CardTitle>

                    <div className="flex gap-1">

                    </div>
                  </CardHeader>

                  <CardContent>
                    <ReactECharts
                      option={trendOption}
                      className="h-[320px] w-full"
                      notMerge
                      lazyUpdate
                    />
                  </CardContent>

                </section>

                <section className=" card system-info divide-y divide-border px-2">
                  <div className="card-header">
                    <div>
                      <h2>System information</h2>
                      <p>Last synchronized just now</p>
                    </div>
                  </div>


                  <div>
                    <h2 className="text-sm">Hostname</h2>
                    <h2 className="text-sm">{deviceDetails?.hostname}</h2>

                  </div>
                  <div className="divide-y divide-border">
                    <h2 className="text-sm">Ip address</h2>
                    <h2 className="text-sm">{deviceDetails?.ipAddress}</h2>

                  </div>
                  <div>
                    <h2 className="text-sm">MAC address</h2>
                    <h2 className="text-sm">{deviceDetails?.macAddress}</h2>

                  </div>
                  <div>
                    <h2 className="text-sm">CPU count</h2>
                    <h2 className="text-sm">{deviceDetails?.cpuCount}</h2>

                  </div>
                  <div>
                    <h2 className="text-sm">Total memory</h2>
                    <h2 className="text-sm text-muted-foreground">
                      {deviceDetails?.totalMemoryKb
                        ? `${(deviceDetails.totalMemoryKb / 1024 / 1024).toFixed(2)} GB`
                        : undefined}
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-sm">OS name</h2>
                    <h2 className="text-sm">{deviceDetails?.osName}</h2>

                  </div>
                  <div>
                    <h2 className="text-sm">Kernel version</h2>
                    <h2 className="text-sm">{deviceDetails?.kernelVersion}</h2>

                  </div>
                  <div>
                    <h2 className="text-sm">Team</h2>
                    <h2 className="text-sm">{deviceDetails?.teamName}</h2>
                    {/* <InfoRow label="Team" value={deviceDetails?.teamName} />
                      <InfoRow label="Tenant" value={deviceDetails?.tenantName} /> */}
                  </div>
                  <div>
                    <h2 className="text-sm">Tenant</h2>
                    <h2 className="text-sm">{deviceDetails?.tenantName}</h2>

                  </div>


                  {/* ))} */}
                </section>

              </div>
            </div>
          </TabsContent>

          <TabsContent value="Metrics" className="mt-4">
            <div className="detail-content">
              {detailStats}
            </div>
          </TabsContent>
          <TabsContent value="Logs" className="">
            <Card className="overflow-hidden border-border/80">
              <CardHeader className=" border-border/70 pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" />
                  Live device logs
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Streaming structured logs from the connected agent
                </p>
              </CardHeader>
              <CardContent className=" container">
                {id && <DeviceLogs deviceId={id} />}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="Commands" className="mt-4">
            {/* <Commands /> */}
          </TabsContent>

          <TabsContent value="Configuration" className="mt-4">
            <section className="card tab-state">
              <span><Icon name="settings" size={24} /></span>
              <h2>Configuration</h2>
              <p>Device-specific configuration for <code>dev_ac_12f9</code>.</p>
              <Button variant="secondary">Configure view</Button>
            </section>
          </TabsContent>
        </Tabs>
      </div>


      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" value={tab} onValueChange={setTab} className="flex flex-col space-y-4">



        {/* Metrics */}
        <TabsContent value="Metrics" className="mt-0">
          {id && <DeviceMetrics id={id} />}
        </TabsContent>



        {/* Commands */}
        <TabsContent value="Commands" className="mt-0" id="commands">
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
        {/* Command history — table layout matching EdgePulse */}
        <TabsContent value="Command History" className="mt-0">
          <Card>
            <CardHeader className="flex flex-col gap-3 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Command history
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Auditable execution history for this device
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="RUNNING">Running</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Export audit log
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {commandHistory?.content?.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No commands have been recorded for this device.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Command</th>
                        {/* <th className="px-4 py-3 font-medium">Requested by</th> */}
                        <th className="px-4 py-3 font-medium">Started</th>
                        <th className="px-4 py-3 font-medium">Exit</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="w-10 px-3 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {commandHistory?.content?.map((command) => {
                        const isFailed =
                          command.status === "FAILED"

                        const isSuccess =

                          command.status === "SUCCESS";
                        const requestedBy = command.aiGenerated
                          ? "AI generated"
                          : command.userId || "Unknown";

                        return (
                          <tr
                            key={command.id}
                            className="group transition-colors hover:bg-muted/25"
                          >
                            <td className="px-5 py-3.5">
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">
                                  {command.command}
                                </p>
                                {command.aiGenerated && (
                                  <span className="mt-0.5 inline-block text-[11px] text-muted-foreground">
                                    AI approved
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground">
                              {requestedBy}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                              {new Date(command.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                              {command.exitCode !== null && command.exitCode !== undefined
                                ? command.exitCode
                                : "—"}
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge
                                tone={isSuccess ? "success" : isFailed ? "danger" : "neutral"}
                              // className={
                              //   isSuccess
                              //     ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                              //     : isFailed
                              //       ? "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400"
                              //       : "text-muted-foreground"
                              // }
                              >
                                {command.status}
                              </Badge>
                            </td>
                            <td className="px-3 py-3.5">
                              <Button

                                variant="ghost"

                                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                              >
                                <span className="text-muted-foreground">⋯</span>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {commandHistory && commandHistory.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                  <span className="text-xs text-muted-foreground">
                    Page {commandHistory.number + 1} of {commandHistory.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <ShadecnButton
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={commandHistory.first}
                      onClick={() => setCommandHistoryPage((p) => p - 1)}
                    >
                      Previous
                    </ShadecnButton>
                    <ShadecnButton
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={commandHistory.last}
                      onClick={() => setCommandHistoryPage((p) => p + 1)}
                    >
                      Next
                    </ShadecnButton>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="AI Analysis" className="mt-0">
          <div className="analysis-page">
            <PageHeading
              title="AI incident analysis"
              subtitle="Investigate incidents with evidence-backed diagnostic suggestions."
              actions={
                <>
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

                </>
              }
            />

            {aiAnalysisQueryisLoading && (
              <div className="card analysis-loading">
                <Spinner className="h-5 w-5" />
                <p>Analyzing device history…</p>
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
                <div className="card analysis-empty">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  <h3>No incidents detected</h3>
                  <p>This device is behaving normally.</p>
                </div>
              )}

            {!aiAnalysisQueryisLoading &&
              !aiAnalysisQueryError &&
              aiAnalysisQuery?.content &&
              aiAnalysisQuery.content.length > 0 && (
                <>


                  <div className="analysis-layout">
                    {/* Left: incident history */}
                    <aside className="card incident-list">


                      <div className="card incident-list">
                        {aiAnalysisQuery.content.map((incident) => {
                          const severity = getSeverityStyle(incident.severity);
                          // console.log(incident.severity)
                          // console.log(severity)
                          const isSelected =
                            expandedIncidentId === incident.incidentId;

                          return (
                            <button
                              type="button"
                              key={incident.incidentId}
                              className={`incident-list-item ${isSelected ? "selected" : ""
                                }`}
                              onClick={() =>
                                setExpandedIncidentId(incident.incidentId)
                              }
                            >
                              <span className="incident-list-meta">
                                <Badge


                                  // tone={incident.severity === "Critical" ? "red" : incident.severity === "Warning" ? "orange" : incident.severity === "Info" ? "blue" : "neutral"}
                                  tone={
                                    incident.severity.toUpperCase() === "HIGH"
                                      ? "danger"
                                      : incident.severity.toUpperCase() === "MEDIUM"
                                        ? "warning"
                                        : "neutral"
                                  }
                                >
                                  {incident.severity}
                                </Badge>

                                <small>
                                  {new Date(
                                    incident.createdAt
                                  ).toLocaleString()}
                                </small>
                              </span>

                              <b>{incident.problem}</b>

                              {/* <code>{incident.deviceId}</code> */}
                            </button>
                          );
                        })}
                      </div>
                    </aside>

                    {/* Right: selected incident details */}
                    <section className="card analysis-detail">
                      {(() => {
                        const selectedIncident =
                          aiAnalysisQuery.content.find(
                            (incident) =>
                              incident.incidentId === expandedIncidentId
                          ) ?? latestIncident ?? aiAnalysisQuery.content[0];

                        if (!selectedIncident) return null;

                        return (
                          <IncidentSummary
                            key={selectedIncident.incidentId}
                            incident={selectedIncident}
                            expanded
                            onToggle={() => setExpandedIncidentId(null)}
                            onApprove={(priority, command) =>
                              approveCommand(
                                selectedIncident,
                                priority,
                                command
                              )
                            }
                            approvingPriority={approvingPriority}
                            approvedKeys={approvedRecommendationKeys}
                          />
                        );
                      })()}
                    </section>
                  </div>

                  {/* Pagination */}
                  {aiAnalysisQuery.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 border-t border-border pt-4">
                      <ShadecnButton

                        //  variant="outline"
                        size="sm"
                        disabled={aiAnalysisQuery.first}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        Previous
                      </ShadecnButton>
                      {Array.from(
                        { length: aiAnalysisQuery.totalPages },
                        (_, i) => i
                      ).map((page) => (
                        <ShadecnButton
                          key={page}

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
                        </ShadecnButton>
                      ))}
                      <ShadecnButton

                        // variant="outline"
                        size="sm"
                        disabled={aiAnalysisQuery.last}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        Next
                      </ShadecnButton>
                    </div>
                  )}
                </>
              )}
          </div>
        </TabsContent>

        {/* AI Analysis */}
        {/* <TabsContent value="AI Analysis" className="mt-0">
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default DeviceDetailsPage;
