import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Router, Gauge, Network, Thermometer } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { api } from '../../../services/api';
import { Metrics } from '@/types';
import DeviceTerminal from '@/components/Deviceterminal';

// ---------- Time range options ----------

const TIME_RANGES = [
  { label: '1H', value: '-1h' },
  { label: '6H', value: '-6h' },
  { label: '24H', value: '-24h' },
  { label: '7D', value: '-7d' },
] as const;

type TimeRangeValue = (typeof TIME_RANGES)[number]['value'];

// ---------- Chart option builders ----------

function buildTrendOption(metrics: Metrics[]) {
  const timestamps = metrics.map((m) =>
    new Date(m.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );
  const cpuData = metrics.map((m) => Number((m.cpu ?? 0).toFixed(2)));
  const ramData = metrics.map((m) => Number((m.ram ?? 0).toFixed(2)));

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['CPU %', 'RAM %'] },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: { type: 'category', data: timestamps, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'CPU %',
        type: 'line',
        data: cpuData,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: '#1976d2', width: 2 },
        itemStyle: { color: '#1976d2' },
      },
      {
        name: 'RAM %',
        type: 'line',
        data: ramData,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: '#2e7d32', width: 2 },
        itemStyle: { color: '#2e7d32' },
      },
    ],
  };
}

function buildGaugeOption(currentCpu: number, currentRam: number) {
  const baseGauge = {
    type: 'gauge' as const,
    min: 0,
    max: 100,
    radius: '90%',
    progress: { show: true, width: 10 },
    axisLine: { lineStyle: { width: 10 } },
    axisTick: { show: false },
    splitLine: { length: 8 },
    axisLabel: { fontSize: 10 },
    pointer: { width: 3 },
    title: { fontSize: 13, offsetCenter: [0, '70%'] },
    detail: {
      valueAnimation: true,
      formatter: '{value}%',
      fontSize: 18,
      offsetCenter: [0, '95%'],
    },
  };

  return {
    series: [
      {
        ...baseGauge,
        name: 'CPU %',
        center: ['25%', '55%'],
        itemStyle: { color: '#1976d2' },
        data: [{ value: currentCpu, name: 'CPU' }],
      },
      {
        ...baseGauge,
        name: 'RAM %',
        center: ['75%', '55%'],
        itemStyle: { color: '#2e7d32' },
        data: [{ value: currentRam, name: 'RAM' }],
      },
    ],
  };
}

function buildStatsOption(metrics: Metrics[]) {
  const cpuVals = metrics.map((m) => m.cpu ?? 0);
  const ramVals = metrics.map((m) => m.ram ?? 0);

  const stats = (vals: number[]) => ({
    min: Number(Math.min(...vals).toFixed(2)),
    avg: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
    max: Number(Math.max(...vals).toFixed(2)),
  });

  const cpuStats = stats(cpuVals);
  const ramStats = stats(ramVals);

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['CPU %', 'RAM %'] },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: ['Min', 'Avg', 'Max'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'CPU %',
        type: 'bar',
        data: [cpuStats.min, cpuStats.avg, cpuStats.max],
        itemStyle: { color: '#1976d2', borderRadius: [4, 4, 0, 0] },
        barGap: '10%',
      },
      {
        name: 'RAM %',
        type: 'bar',
        data: [ramStats.min, ramStats.avg, ramStats.max],
        itemStyle: { color: '#2e7d32', borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
}

function buildDistributionOption(metrics: Metrics[]) {
  // Bucket CPU readings into ranges to show usage distribution
  const buckets = [
    { label: '0-20%', min: 0, max: 20 },
    { label: '20-40%', min: 20, max: 40 },
    { label: '40-60%', min: 40, max: 60 },
    { label: '60-80%', min: 60, max: 80 },
    { label: '80-100%', min: 80, max: 100 },
  ];

  const counts = buckets.map(
    (b) => metrics.filter((m) => (m.cpu ?? 0) >= b.min && (m.cpu ?? 0) < b.max).length
  );

  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        name: 'CPU Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: buckets.map((b, i) => ({ name: b.label, value: counts[i] })),
      },
    ],
  };
}

// ---------- Component ----------

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<any>(null);
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('-24h');

  useEffect(() => {
    fetchDevice();
  }, [id, timeRange]);

  const fetchDevice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/query/metrics/deviceid/${id}?startTime=${timeRange}`);
      setMetrics(response.data);
    } catch (err) {
      setError('Failed to load metrics details');
    } finally {
      setLoading(false);
    }
  };

  const latest = metrics[metrics.length - 1];
  const currentCpu = Number((latest?.cpu ?? 0).toFixed(2));
  const currentRam = Number((latest?.ram ?? 0).toFixed(2));
  const activeRangeLabel = TIME_RANGES.find((r) => r.value === timeRange)?.label ?? '';

  const trendOption = useMemo(() => buildTrendOption(metrics), [metrics]);
  const gaugeOption = useMemo(
    () => buildGaugeOption(currentCpu, currentRam),
    [currentCpu, currentRam]
  );
  const statsOption = useMemo(() => buildStatsOption(metrics), [metrics]);
  const distributionOption = useMemo(() => buildDistributionOption(metrics), [metrics]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !metrics.length) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || 'Metrics not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* device header info goes here once `device` is populated */}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/devices/${id}/edit`)}>
            Edit
          </Button>
          <Button onClick={() => navigate(`/devices/${id}/commands`)}>
            Send Command
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2 text-white">
                <Router className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2 text-white">
                <Gauge className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2 text-white">
                <Network className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500 p-2 text-white">
                <Thermometer className="h-5 w-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="metrics" className="space-y-4 flex flex-col">

        <div className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          </TabsList>
        </div>
        <div>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Trend line chart with time-range selector */}
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Real-time Metrics (Last {activeRangeLabel})</CardTitle>
                  <div className="flex gap-1">
                    {TIME_RANGES.map((range) => (
                      <Button
                        key={range.value}
                        size="sm"
                        variant={timeRange === range.value ? 'default' : 'outline'}
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
                    style={{ height: 320, width: '100%' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>CPU Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts
                    option={distributionOption}
                    style={{ height: 280, width: '100%' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </CardContent>
              </Card>
              {/* Current snapshot gauges */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts
                    option={gaugeOption}
                    style={{ height: 320, width: '100%' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </CardContent>
              </Card>

              {/* Min / Avg / Max bar chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Min / Avg / Max ({activeRangeLabel})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts
                    option={statsOption}
                    style={{ height: 280, width: '100%' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </CardContent>
              </Card>

              {/* CPU usage distribution pie */}
              
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Device Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Log viewer will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Command History</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <DeviceTerminal  deviceId={id}/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>Device Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configuration editor will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">AI insights and predictions will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DeviceDetailsPage;