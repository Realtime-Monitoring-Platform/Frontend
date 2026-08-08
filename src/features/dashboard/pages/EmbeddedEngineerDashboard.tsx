import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Router, Bell, Send, Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';

 const EmbeddedEngineerDashboard = () => {
  const { data: kpisData, isLoading, error } = useQuery({
    queryKey: ['embedded-engineer-dashboard'],
    queryFn: () => api.get('/embedded-engineer/dashboard/kpis').then(res => res.data),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertDescription>Failed to load dashboard data</AlertDescription></Alert>;
  }

  const kpis = [
    { title: 'Assigned Devices', value: kpisData?.assignedDevices ?? 0, subtitle: '20 online, 4 offline', icon: <Router className="h-5 w-5" />, color: '#1976d2' },
    { title: 'Alerts Requiring Action', value: kpisData?.alertsRequiringAction ?? 0, subtitle: '2 critical, 3 warning', icon: <Bell className="h-5 w-5" />, color: '#dc004e' },
    { title: 'Pending Commands', value: kpisData?.pendingCommands ?? 0, subtitle: '1 executing, 2 queued', icon: <Send className="h-5 w-5" />, color: '#ed6c02' },
    { title: 'Avg Response Time', value: kpisData?.avgResponseTime ? `${kpisData.avgResponseTime}ms` : '0ms', trend: -12, trendLabel: 'improvement', icon: <Gauge className="h-5 w-5" />, color: '#2e7d32' },
  ];

  const performanceData = [
    { time: '00:00', cpu: 45, ram: 62, disk: 71 },
    { time: '04:00', cpu: 38, ram: 58, disk: 71 },
    { time: '08:00', cpu: 65, ram: 75, disk: 73 },
    { time: '12:00', cpu: 78, ram: 82, disk: 75 },
    { time: '16:00', cpu: 72, ram: 78, disk: 74 },
    { time: '20:00', cpu: 55, ram: 68, disk: 72 },
    { time: '24:00', cpu: 48, ram: 63, disk: 71 },
  ];

  const recentCommands = [
    { id: 1, device: 'Sensor Array A1', command: 'RESTART_SERVICE', status: 'SUCCESS', time: '2 hours ago' },
    { id: 2, device: 'Gateway B2', command: 'CLEAR_CACHE', status: 'EXECUTING', time: '5 minutes ago' },
    { id: 3, device: 'Controller C3', command: 'UPDATE_CONFIG', status: 'PENDING', time: '1 hour ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-500';
      case 'EXECUTING': return 'bg-blue-500';
      case 'PENDING': return 'bg-amber-500';
      case 'FAILED': return 'bg-destructive';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Engineer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage your assigned devices</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  {kpi.subtitle && (
                    <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                  )}
                  {kpi.trend && (
                    <p className="text-xs text-green-600">{kpi.trend}% {kpi.trendLabel}</p>
                  )}
                </div>
                <div className="rounded-lg p-2" style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}>
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Device Performance (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#1976d2" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="ram" stroke="#2e7d32" strokeWidth={2} name="RAM %" />
                <Line type="monotone" dataKey="disk" stroke="#ed6c02" strokeWidth={2} name="Disk %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Commands */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCommands.map((cmd) => (
                <div key={cmd.id} className="rounded-md border border-border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{cmd.device}</span>
                    <Badge className={getStatusColor(cmd.status)}>
                      {cmd.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{cmd.command}</p>
                  <p className="text-xs text-muted-foreground">{cmd.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbeddedEngineerDashboard;