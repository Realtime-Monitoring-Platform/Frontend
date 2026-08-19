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
import DeviceLogs from './DeviceLogs';
import DeviceMetrics from './DeviceMetrics';

// ---------- Time range options ----------

const TIME_RANGES = [
  { label: '1H', value: '-1h' },
  { label: '6H', value: '-6h' },
  { label: '24H', value: '-24h' },
  { label: '7D', value: '-7d' },
] as const;

type TimeRangeValue = (typeof TIME_RANGES)[number]['value'];

// ---------- Chart option builders ----------




// ---------- Component ----------

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [device, setDevice] = useState<any>(null);
  // const [metrics, setMetrics] = useState<Metrics[]>([]);
  // const [timeRange, setTimeRange] = useState<TimeRangeValue>('-24h');

  // useEffect(() => {
  //   fetchDevice();
  // }, [id, timeRange]);

  // const fetchDevice = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await api.get(`/query/metrics/deviceid/${id}?startTime=${timeRange}`);
  //     setMetrics(response.data);
  //   } catch (err) {
  //     setError('Failed to load metrics details');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const latest = metrics[metrics.length - 1];
  // const currentCpu = Number((latest?.cpu ?? 0).toFixed(2));
  // const currentRam = Number((latest?.ram ?? 0).toFixed(2));
  // const activeRangeLabel = TIME_RANGES.find((r) => r.value === timeRange)?.label ?? '';

  // const trendOption = useMemo(() => buildTrendOption(metrics), [metrics]);
  // const gaugeOption = useMemo(
  //   () => buildGaugeOption(currentCpu, currentRam),
  //   [currentCpu, currentRam]
  // );
  // const statsOption = useMemo(() => buildStatsOption(metrics), [metrics]);
  // const distributionOption = useMemo(() => buildDistributionOption(metrics), [metrics]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // if (error || !metrics.length) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertDescription>{error || 'Metrics not found'}</AlertDescription>
  //     </Alert>
  //   );
  // }

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
      <Tabs defaultValue="overview" className="space-y-4 flex flex-col">

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
            
                 {
                  id && (
                    <DeviceMetrics id={id} />
                  )
                } 

              
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Device Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {
                  id && (
                    <DeviceLogs deviceId={id} />
                  )
                }

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Command History</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <DeviceTerminal deviceId={id} />
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