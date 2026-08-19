import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactECharts from "echarts-for-react";

import { fetchDeviceMetrics } from "@/services/deviceAction";
import {
  buildDistributionOption,
  buildGaugeOption,
  buildStatsOption,
  buildTrendOption,
  TIME_RANGES,
} from "@/Utils";

import { useQuery } from "@tanstack/react-query";

type TimeRangeValue = (typeof TIME_RANGES)[number]["value"];

interface DeviceMetricsProps {
  id: string;
}

const DeviceMetrics = ({ id }: DeviceMetricsProps) => {
  const [timeRange, setTimeRange] =
    useState<TimeRangeValue>("-24h");

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
        <Card className="lg:col-span-2">
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
        <Card className="lg:col-span-2">
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
        </Card>

      </div>
    </div>
  );
};

export default DeviceMetrics;