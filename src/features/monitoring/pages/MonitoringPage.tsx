import { useMemo } from 'react';
import { Activity, AlertCircle, Clock3, Gauge, RefreshCw, Server, Wifi, WifiOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { fetchDeviceMetrics, getAllDeviceBytenanntId, getAllDevices } from '@/services/deviceAction';
import { useAuth } from '@/hooks/useAuth';
import type { Device, Metrics } from '@/types';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DeviceSnapshot = {
  device: Device;
  metrics: Metrics[];
  latest?: Metrics;
};

const metricValue = (value: number | undefined) => Math.round(Number(value || 0));

const progressColor = (value: number) =>
  value >= 80 ? 'bg-red-500' : value >= 60 ? 'bg-amber-500' : 'bg-[#82C8E5]';


const statusStyle = (status?: string) => {
  const normalized = String(status || 'UNKNOWN').toUpperCase();
  if (['ONLINE', 'ACTIVE'].includes(normalized)) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (['WARNING', 'MAINTENANCE'].includes(normalized)) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-slate-600 bg-slate-50 border-slate-200';
};

const MonitoringPage = () => {
  const { user } = useAuth();
  const isPlatformAdmin = user?.role === 'PLATFORM_ADMIN';

  const { data: devices, isLoading: devicesLoading, error: devicesError, refetch, isFetching: devicesFetching } = useQuery({
    queryKey: ['monitoringDevices', user?.tenantId, isPlatformAdmin],
    queryFn: () => isPlatformAdmin
      ? getAllDevices(0, 100)
      : getAllDeviceBytenanntId(user?.tenantId || '', 0, 100),
    enabled: Boolean(user && (isPlatformAdmin || user.tenantId)),
    staleTime: 30_000,
  });

  const deviceList = devices?.content || [];
  const { data: snapshots = [], isLoading: metricsLoading, refetch: refetchSnapshots, isFetching: metricsFetching } = useQuery<DeviceSnapshot[]>({
    queryKey: ['monitoringSnapshots', deviceList.map((device) => device.id).join(',')],
    queryFn: async () => Promise.all(deviceList.map(async (device) => {
      try {
        const metrics = await fetchDeviceMetrics(device.id, '-24h') as Metrics[];
        return { device, metrics: metrics || [], latest: metrics?.[metrics.length - 1] };
      } catch {
        return { device, metrics: [] };
      }
    })),
    enabled: deviceList.length > 0,
    staleTime: 30_000,
  });

  const summary = useMemo(() => {
    const online = deviceList.filter((device) => ['ONLINE', 'ACTIVE'].includes(String(device.status).toUpperCase())).length;
    const attention = deviceList.filter((device) => ['WARNING', 'MAINTENANCE', 'OFFLINE', 'DISCONNECTED'].includes(String(device.status).toUpperCase())).length;
    const readings = snapshots.flatMap((snapshot) => snapshot.metrics);
    const average = (key: 'cpu' | 'ram') => readings.length
      ? Math.round(readings.reduce((total, reading) => total + Number(reading[key] || 0), 0) / readings.length)
      : 0;
    return { online, attention, averageCpu: average('cpu'), averageRam: average('ram') };
  }, [deviceList, snapshots]);

  const performanceData = useMemo(() => {
    const grouped = new Map<string, { cpu: number[]; ram: number[] }>();
    snapshots.flatMap((snapshot) => snapshot.metrics).forEach((metric) => {
      const key = new Date(metric.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const current = grouped.get(key) || { cpu: [], ram: [] };
      current.cpu.push(Number(metric.cpu || 0));
      current.ram.push(Number(metric.ram || 0));
      grouped.set(key, current);
    });
    return [...grouped.entries()].slice(-24).map(([time, values]) => ({
      time,
      cpu: Math.round(values.cpu.reduce((sum, value) => sum + value, 0) / values.cpu.length),
      ram: Math.round(values.ram.reduce((sum, value) => sum + value, 0) / values.ram.length),
    }));
  }, [snapshots]);

  if (devicesLoading || metricsLoading) {
    return <div className="flex h-96 items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  }

  if (devicesError) {
    return <Alert variant="destructive"><AlertDescription>Unable to load live monitoring data.</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="relative overflow-hidden rounded-xl border border-[#82C8E5]/60 bg-[#82C8E5]/[0.08] px-5 py-6 shadow-sm sm:px-7">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#82C8E5]/30 to-transparent" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3F819C]"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span> Live operations</p>
            <h1 className="text-3xl font-semibold tracking-tight">Real-time Monitoring</h1>
            <p className="mt-1 text-sm text-muted-foreground">Live health snapshots from your connected Linux devices.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">Auto-refresh every 30 seconds</span>
            <Button variant="outline" size="icon" onClick={() => { void refetch(); void refetchSnapshots(); }} disabled={devicesFetching || metricsFetching} aria-label="Refresh monitoring data"><RefreshCw className={`h-4 w-4 ${devicesFetching || metricsFetching ? 'animate-spin' : ''}`} /></Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total devices', value: deviceList.length, icon: Server },
          { label: 'Online now', value: summary.online, icon: Wifi },
          { label: 'Needs attention', value: summary.attention, icon: WifiOff },
          { label: 'Average CPU', value: `${summary.averageCpu}%`, icon: Activity },
          { label: 'Average RAM', value: `${summary.averageRam}%`, icon: Gauge },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="rounded-lg bg-[#82C8E5]/25 p-2.5 text-[#3F819C]"><Icon className="h-4 w-4" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 text-xl font-semibold tracking-tight">{value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-border/70 pb-4"><div className="flex items-center justify-between gap-3"><div><CardTitle>Fleet performance</CardTitle><p className="mt-1 text-sm text-muted-foreground">Average resource utilization across monitored devices.</p></div><span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><Clock3 className="h-3.5 w-3.5" /> Last 24 hours</span></div></CardHeader>
        <CardContent>
          {performanceData.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">No metric readings are available yet.</p> : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%"><LineChart data={performanceData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} /><Tooltip formatter={(value) => [`${value}%`, '']} /><Line type="monotone" dataKey="cpu" stroke="#82C8E5" strokeWidth={2.5} dot={false} name="CPU" /><Line type="monotone" dataKey="ram" stroke="#3F819C" strokeWidth={2.5} dot={false} name="RAM" /></LineChart></ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold tracking-tight">Device health</h2><p className="text-sm text-muted-foreground">Latest reported readings by device.</p></div><span className="text-xs text-muted-foreground">{snapshots.length} devices reporting</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {snapshots.map(({ device, latest }) => {
          const cpu = metricValue(latest?.cpu);
          const ram = metricValue(latest?.ram);
          return <Card key={device.id} className="overflow-hidden transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{device.deviceName}</p><p className="mt-1 truncate font-mono text-xs text-muted-foreground">{device.hostname || device.id}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${statusStyle(device.status)}`}>{device.status || 'UNKNOWN'}</span></div>{latest ? <div className="mt-5 space-y-3">{[['CPU', cpu], ['RAM', ram]].map(([label, value]) => <div key={label as string}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}%</span></div><div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${progressColor(value as number)}`} style={{ width: `${Math.min(value as number, 100)}%` }} /></div></div>)}</div> : <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground"><AlertCircle className="h-4 w-4" />No metrics reported</div>}<p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{latest ? `Updated ${new Date(latest.timestamp).toLocaleTimeString()}` : 'Waiting for device telemetry'}</p></CardContent></Card>;
        })}
      </div>
    </div>
  );
};

export default MonitoringPage;