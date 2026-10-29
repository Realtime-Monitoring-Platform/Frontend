import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactECharts from "echarts-for-react";

import { fetchDeviceMetrics, fetchLatestDeviceMetrics } from "@/services/deviceAction";
import {
  buildDistributionOption,
  buildGaugeOption,
  buildStatsOption,
  buildTrendOption,
  TIME_RANGES,
} from "@/Utils";

import { useQuery } from "@tanstack/react-query";
import type { MetricsSnapshot } from "@/types";
import { Badge } from "@/Utils/Badge";
import { Icon } from "@/Utils/Icon";

type TimeRangeValue = (typeof TIME_RANGES)[number]["value"];

interface DeviceMetricsProps {
  id: string;
}

/** Human readable byte size (B / KB / MB / GB / TB) */
const formatBytes = (bytes?: number | null): string => {
  if (bytes === undefined || bytes === null || Number.isNaN(bytes)) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const sign = bytes < 0 ? "-" : "";
  let value = Math.abs(bytes);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${sign}${value.toFixed(value >= 100 || unit === 0 ? 0 : 1)} ${units[unit]}`;
};
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
const MetricRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

const DeviceMetrics = ({ id }: DeviceMetricsProps) => {
  const [timeRange, setTimeRange] =
    useState<TimeRangeValue>("-7d");

  const {
    data: metrics = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deviceMetrics", id, timeRange],
    queryFn: () => fetchDeviceMetrics(id, timeRange),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  //console.log("metrics", metrics[metrics.length - 1].);  
  // Latest full report of the agent: cpu/ram + memory + disks + network interfaces
  const { data: snapshot } = useQuery<MetricsSnapshot | null>({
    queryKey: ["deviceMetricsSnapshot", id, timeRange],
    queryFn: () => fetchLatestDeviceMetrics(id, timeRange),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
  console.log("snapshot", snapshot);
  const latest = metrics.at(-1);

  const currentCpu = Number((latest?.cpu ?? 0).toFixed(2));
  const currentRam = Number((latest?.ram ?? 0).toFixed(2));

  const activeRangeLabel = useMemo(
    () =>
      TIME_RANGES.find((range) => range.value === timeRange)?.label ??
      "",
    [timeRange]
  );

  const trendOption = useMemo(
    () => buildTrendOption(metrics),
    [metrics]
  );

  const gaugeOption = useMemo(
    () => buildGaugeOption(currentCpu, currentRam),
    [currentCpu, currentRam]
  );

  const statsOption = useMemo(
    () => buildStatsOption(metrics),
    [metrics]
  );

  const distributionOption = useMemo(
    () => buildDistributionOption(metrics),
    [metrics]
  );

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load device metrics"}
        </AlertDescription>
      </Alert>
    );
  }

  if (metrics.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No metrics found for this device.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

        {/* Metrics trend */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>
              Real-time Metrics{" "}
              <span className="text-muted-foreground">
                (Last {activeRangeLabel})
              </span>
            </CardTitle>

            <div className="flex gap-1">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.value}
                  size="sm"
                  variant={
                    timeRange === range.value
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
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
        </Card>

        {/* CPU distribution */}
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            <ReactECharts
              option={distributionOption}
              className="h-[280px] w-full"
              notMerge
              lazyUpdate
            />
          </CardContent>
        </Card>

        {/* Current snapshot */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Snapshot</CardTitle>
          </CardHeader>

          <CardContent>
            <ReactECharts
              option={gaugeOption}
              className="h-[320px] w-full"
              notMerge
              lazyUpdate
            />
          </CardContent>
        </Card>

        {/* Statistics */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Min / Avg / Max ({activeRangeLabel})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ReactECharts
              option={statsOption}
              className="h-[280px] w-full"
              notMerge
              lazyUpdate
            />
          </CardContent>
        </Card> */}

      </div>

      {/* ── Latest agent report: memory / disks / network ───────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Memory breakdown */}
        {/* <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Memory</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2.5 text-sm">
            {snapshot?.memory ? (
              <>
                <MetricRow
                  label="Total"
                  value={formatBytes(kbToBytes(snapshot.memory.total_kb))}
                />
                <MetricRow
                  label="Used"
                  value={formatBytes(kbToBytes(snapshot.memory.used_kb))}
                />
                <MetricRow
                  label="Available"
                  value={formatBytes(kbToBytes(snapshot.memory.available_kb))}
                />
                <MetricRow
                  label="Free"
                  value={formatBytes(kbToBytes(snapshot.memory.free_kb))}
                />
                <MetricRow
                  label="Swap"
                  value={`${formatBytes(
                    kbToBytes(snapshot.memory.swap_used_kb)
                  )} / ${formatBytes(kbToBytes(snapshot.memory.swap_total_kb))}`}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No memory data reported yet.
              </p>
            )}
          </CardContent>
        </Card> */}

        {/* Disk usage */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Disk usage</CardTitle>
          </CardHeader>

          <CardContent>
            {snapshot?.disks?.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Mount point</th>
                    <th className="pb-2 font-medium">File system</th>
                    <th className="pb-2 font-medium">Usage</th>
                    <th className="pb-2 text-right font-medium">Used / Total</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.disks.map((disk) => (
                    <tr
                      key={disk.mount_point || disk.name}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="py-2 font-mono text-xs">
                        {disk.mount_point || "—"}
                      </td>
                      <td className="py-2">{disk.file_system || "—"}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, disk.used_percent ?? 0)
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums">
                            {formatPercent(disk.used_percent)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        {formatBytes(disk.used_bytes)} /{" "}
                        {formatBytes(disk.total_bytes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No disk data reported yet.
              </p>
            )}
          </CardContent>
        </Card> */}

        {/* Network interfaces */}
        {/* <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Network</CardTitle>
          </CardHeader>

          <CardContent className="text-sm">
            {snapshot?.network?.length ? (
              snapshot.network.map((iface) => (
                <div
                  key={iface["interface"]}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-2 last:border-0"
                >
                  <span className="font-mono text-xs">
                    {iface["interface"] || "—"}
                  </span>
                  <span className="text-right text-xs tabular-nums text-muted-foreground">
                    ↓ {formatBytes(iface.received_bytes)}
                    <br />↑ {formatBytes(iface.transmitted_bytes)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No network data reported yet.
              </p>
            )}
          </CardContent>
        </Card> */}
        {/* <section className="card disk-panel"><div className="card-header"><div><h2>Disk usage</h2><p>Mounted file systems reported by the device</p></div><Badge tone="warning">High usage</Badge></div><div className="resource-table-head"><span>Mount point</span><span>File system</span><span>Usage</span><span>Used / Total</span></div><div className="disk-row"><code>/</code><code>ext4</code><div className="disk-usage"><div><i /></div><b>85.7%</b></div><strong>20.9 GB / 24.4 GB</strong></div></section>
        <section className="card network-panel lg:col-span-3"><div className="card-header"><div><h2>Network</h2><p>Traffic totals by available interface</p></div><Badge tone="success" dot>Reporting</Badge></div><div className="network-interfaces">{[["docker0", "0 B", "0 B"], ["enp0s3", "49.4 MB", "7.2 MB"], ["enp0s8", "347 KB", "823 KB"], ["lo", "2.1 MB", "2.1 MB"]].map(([name, down, up]) => <div key={name}><span className="interface-icon"><Icon name="activity" size={15} /></span><code>{name}</code><p><span>↓</span><b>{down}</b></p><p><span>↑</span><b>{up}</b></p></div>)}</div></section>
        <section className="card memory-panel"><div className="card-header"><div><h2>Memory</h2><p>Physical and swap capacity</p></div><Badge tone="info">31% used</Badge></div><div className="memory-overview"><div className="memory-ring"><span><b>2.8 TB</b><small>of 9.1 TB used</small></span></div><div className="memory-values">{[["Total", "9.1 TB"], ["Used", "2.8 TB"], ["Available", "6.2 TB"], ["Free", "1.1 TB"], ["Swap", "0 B / 0 B"]].map(([name, value]) => <div key={name}><span>{name}</span><b>{value}</b></div>)}</div></div></section>
         */}

        {/* Disk usage */}
        <section className="card disk-panel">
          <div className="card-header">
            <div>
              <h2>Disk usage</h2>
              <p>Mounted file systems reported by the device</p>
            </div>

            {snapshot?.disks?.some((disk) => (disk.used_percent ?? 0) >= 80) && (
              <Badge tone="warning">High usage</Badge>
            )}
          </div>

          {snapshot?.disks?.length ? (
            <>
              <div className="resource-table-head">
                <span>Mount point</span>
                <span>File system</span>
                <span>Usage</span>
                <span>Used / Total</span>
              </div>

              {snapshot.disks.map((disk) => (
                <div
                  className="disk-row"
                  key={disk.mount_point || disk.name}
                >
                  <code>{disk.mount_point || "—"}</code>

                  <code>{disk.file_system || "—"}</code>

                  <div className="disk-usage">
                    <div>
                      <i
                        style={{
                          width: `${Math.min(
                            100,
                            getPercentage(disk.used_bytes, disk.total_bytes)
                          )}%`,
                        }}
                      />
                    </div>

                    <b>{getPercentage(disk.used_bytes, disk.total_bytes).toFixed(1)}%</b>
                  </div>

                  <strong>
                    {formatBytes(disk.used_bytes)} /{" "}
                    {formatBytes(disk.total_bytes)}
                  </strong>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No disk data reported yet.
            </p>
          )}
        </section>

        {/* Network interfaces */}
        <section className="card network-panel lg:col-span-2">
          <div className="card-header">
            <div>
              <h2>Network</h2>
              <p>Traffic totals by available interface</p>
            </div>

            <Badge tone="success" dot>
              Reporting
            </Badge>
          </div>

          <div className="network-interfaces">
            {snapshot?.network?.length ? (
              snapshot.network.map((iface) => (
                <div key={iface["interface"]}>
                  <span className="interface-icon">
                    <Icon name="activity" size={15} />
                  </span>

                  <p className="text-xl">{iface["interface"] || "—"}</p>

                  <p>
                    <span>↓</span>
                    <p>{formatBytes(iface.received_bytes)}</p>
                  </p>

                  <p>
                    <span>↑</span>
                    <p>{formatBytes(iface.transmitted_bytes)}</p>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No network data reported yet.
              </p>
            )}
          </div>
        </section>
       

        {/* Memory */}
        <section className="card memory-panel lg:col-span-2">
          <div className="card-header">
            <div>
              <h2>Memory</h2>
              <p>Physical and swap capacity</p>
            </div>

            {snapshot?.memory && (
              <Badge tone="info">
                {snapshot.memory.total_kb && snapshot.memory.total_kb > 0
                  ? `${getPercentage(
                    snapshot?.memory?.used_kb,
                    snapshot?.memory?.total_kb
                  ).toFixed(1)}% used`
                  : "0% used"}
              </Badge>
            )}
          </div>

          {snapshot?.memory ? (
            <div className="memory-overview">
              
              <div
                className="memory-ring"

  //               style={{
  //                 background: `conic-gradient(
  //   var(--primary) ${getPercentage(
  //                   snapshot.memory.used_kb,
  //                   snapshot.memory.total_kb
  //                 ).toFixed(1)}%,
  //   var(--muted) 0
  // )`,
  //               }}
              >
                <span>
                  <b>{formatGB(snapshot.memory.used_kb)}</b>
                  <small>of {formatGB(snapshot.memory.total_kb)} used</small>
                </span>
              </div>

              <div className="memory-values">
                {[
                  ["Total", formatGB(snapshot.memory.total_kb)],
                  ["Used", formatGB(snapshot.memory.used_kb)],
                  ["Available", formatGB(snapshot.memory.available_kb)],
                  ["Free", formatGB(snapshot.memory.free_kb)],
                  [
                    "Swap",
                    `${formatGB(snapshot.memory.swap_used_kb)} / ${formatGB(
                      snapshot.memory.swap_total_kb
                    )}`,
                  ],
                ].map(([name, value]) => (
                  <div key={name}>
                    <span>{name}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No memory data reported yet.
            </p>
          )}
        </section>
      </div>

    </div>
  );
};

export default DeviceMetrics;