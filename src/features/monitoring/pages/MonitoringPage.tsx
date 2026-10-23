import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchDeviceMetrics, getAllDeviceBytenanntId, getAllDevices } from '@/services/deviceAction';
import { useAuth } from '@/hooks/useAuth';
import type { Device, Metrics } from '@/types';
import { AlertRow, Badge, DeviceTable, Icon, MiniChart, PageHeading, StatCard } from '@/Utils/Page';
import { Button } from '@/Utils/Button';

type DeviceSnapshot = {
  device: Device;
  metrics: Metrics[];
  latest?: Metrics;
};

const metricValue = (value: number | undefined) => Math.round(Number(value || 0));

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
    refetchInterval: 30_000,
  });

  const deviceList = devices?.content || [];
  const { data: snapshots = [], isLoading: metricsLoading, refetch: refetchSnapshots, isFetching: metricsFetching } = useQuery<DeviceSnapshot[]>({
    queryKey: ['monitoringSnapshots', deviceList.map((device) => device.id).join(',')],
    queryFn: async () => Promise.all(deviceList.map(async (device) => {
      try {
        const metrics = await fetchDeviceMetrics(device.id, '-24h');
        return { device, metrics, latest: metrics[metrics.length - 1] };
      } catch {
        return { device, metrics: [], latest: undefined };
      }
    })),
    enabled: deviceList.length > 0,
    staleTime: 30_000,
    refetchInterval: 30_000,
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

  const attentionDevices = useMemo(() => {
    const attentionStatuses = ['WARNING', 'MAINTENANCE', 'OFFLINE', 'DISCONNECTED'];
    return deviceList.filter((device) =>
      attentionStatuses.includes(String(device.status || '').toUpperCase())
    );
  }, [deviceList]);

  const attentionDeviceRows = useMemo(() => {
    return attentionDevices.map((device) => {
      const snapshot = snapshots.find((s) => s.device.id === device.id);
      const latest = snapshot?.latest;
      return {
        name: device.deviceName,
        id: device.id,
        model: device.model || 'Unknown',
        team: device.teamName || 'Unknown',
        status: device.status || 'UNKNOWN',
        cpu: latest?.cpu ?? 0,
        memory: latest?.ram ?? 0,
        seen: latest?.timestamp ? new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never',
      };
    });
  }, [attentionDevices, snapshots]);

  
  if (devicesLoading || metricsLoading) {
    return <div className="flex h-96 items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  }

  if (devicesError) {
    return <Alert variant="destructive"><AlertDescription>Unable to load live monitoring data.</AlertDescription></Alert>;
  }

  return (
    <>
    <PageHeading title="Fleet overview" subtitle="Monitor device health, telemetry, and incidents across your organization." actions={<></>} />
    <div className="stats-grid">
      <StatCard label="Total devices" value={String(deviceList.length)} change="+6.2%" icon="device" tone="blue" data="vs. last 7 days" />
      <StatCard label="Online devices" value={String(summary.online)} change="+3.1%" icon="activity" tone="green" data="of fleet" />
      <StatCard label="Needs attention" value={String(summary.attention)} change="+2 today" icon="alert" tone="orange" data="devices at risk" />
      <StatCard label="Avg CPU" value={`${summary.averageCpu}%`} change="live" icon="cpu" tone="blue" data="fleet average" />
      <StatCard label="Avg Memory" value={`${summary.averageRam}%`} change="live" icon="activity" tone="green" data="fleet average" />
    </div>
    <div className="dashboard-grid">
      <section className="card connectivity-card">
        <div className="card-header"><div><h2>Device connectivity</h2><p>Online devices over the last 24 hours</p></div><select defaultValue="24"><option value="24">Last 24 hours</option><option value="7">Last 7 days</option></select></div>
        <div className="chart-legend"><span><i className="blue-dot" />Online devices <b>{summary.online}</b></span><span><i className="slate-dot" />Total devices <b>{deviceList.length}</b></span></div>
        <div className="chart-area">
          <div className="y-axis"><span>150</span><span>100</span><span>50</span><span>0</span></div>
          <div className="large-chart"><i className="expected-line" /><MiniChart /><div className="x-axis"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span></div></div>
        </div>
      </section>
      <section className="card alerts-card">
        <div className="card-header"><div><h2>Recent alerts</h2><p>Incidents requiring attention</p></div><button className="text-btn" onClick={() => {}}>View all <Icon name="chevron" size={14} /></button></div>
        <div className="alert-list">
          {attentionDevices.length > 0 ? (
            attentionDevices.map((device) => {
              const snapshot = snapshots.find((s) => s.device.id === device.id);
              const latest = snapshot?.latest;
              const cpu = metricValue(latest?.cpu);
              const ram = metricValue(latest?.ram);
              const severity = cpu > 80 || ram > 80 ? 'Critical' : cpu > 60 || ram > 60 ? 'Warning' : 'Info';
              return (
                <AlertRow
                  key={device.id}
                  severity={severity}
                  title={`${device.deviceName} telemetry`}
                  device={`${device.hostname || device.id} · CPU ${cpu}% · RAM ${ram}%`}
                  time={latest?.timestamp ? `Updated ${new Date(latest.timestamp).toLocaleTimeString()}` : 'No telemetry'}
                />
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No devices requiring attention.</p>
          )}
        </div>
      </section>
      <section className="card utilization-card">
        <div className="card-header"><div><h2>Fleet utilization</h2><p>Average resource use</p></div><button className="icon-btn"><span>⋯</span></button></div>
        <div className="util-chart">
          <div className="util-label"><span><i className="blue-dot" />CPU</span><b>{summary.averageCpu}%</b></div><MiniChart compact />
          <div className="util-label"><span><i className="green-dot" />Memory</span><b>{summary.averageRam}%</b></div><MiniChart compact color="green" />
        </div>
      </section>
      <section className="card ai-card">
        <div className="card-header"><div><h2>AI incident analysis</h2><p>Latest diagnostic hypotheses</p></div><button className="text-btn" onClick={() => {}}>Open workspace <Icon name="chevron" size={14} /></button></div>
        <div className="analysis-item"><span className="analysis-icon"><Icon name="ai" /></span><div><span><Badge tone="danger">High</Badge><small>12 min ago</small></span><h3>Thermal throttling likely causing process instability</h3><p>Evidence across 3 telemetry signals and 14 log entries.</p></div></div>
        <div className="analysis-item"><span className="analysis-icon"><Icon name="ai" /></span><div><span><Badge tone="warning">Medium</Badge><small>48 min ago</small></span><h3>MQTT reconnect loop after certificate rotation</h3><p>Hypothesis — review the suggested certificate checks.</p></div></div>
      </section>
    </div>
    <section className="card attention-card">
      <div className="card-header"><div><h2>Devices requiring attention</h2><p>Sorted by operational risk</p></div><button className="text-btn" onClick={() => {}}>View device inventory <Icon name="chevron" size={14} /></button></div>
      <DeviceTable rows={attentionDeviceRows} compact />
    </section>
    </>

    
  );
};

export default MonitoringPage;


