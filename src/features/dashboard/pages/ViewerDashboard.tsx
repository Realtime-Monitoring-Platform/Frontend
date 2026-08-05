import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../../../services/api';

export const ViewerDashboard = () => {
  const { data: kpisData, isLoading, error } = useQuery({
    queryKey: ['viewer-dashboard'],
    queryFn: () => api.get('/viewer/dashboard/kpis').then(res => res.data),
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
    { title: 'Total Devices', value: kpisData?.totalDevices ?? 0, icon: <Eye className="h-5 w-5" />, color: '#1976d2' },
    { title: 'Active Alerts', value: kpisData?.activeAlerts ?? 0, icon: <Eye className="h-5 w-5" />, color: '#dc004e' },
    { title: 'System Uptime', value: kpisData?.systemUptime ?? '0%', icon: <Eye className="h-5 w-5" />, color: '#2e7d32' },
  ];

  const deviceStatusData = [
    { name: 'Online', value: 8200, color: '#2e7d32' },
    { name: 'Offline', value: 156, color: '#757575' },
    { name: 'Warning', value: 142, color: '#ed6c02' },
    { name: 'Error', value: 34, color: '#dc004e' },
  ];

  const alertTrendsData = [
    { day: 'Mon', alerts: 12 },
    { day: 'Tue', alerts: 8 },
    { day: 'Wed', alerts: 15 },
    { day: 'Thu', alerts: 10 },
    { day: 'Fri', alerts: 13 },
    { day: 'Sat', alerts: 5 },
    { day: 'Sun', alerts: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Viewer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Read-only overview of monitoring data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                </div>
                <div className="rounded-lg p-2" style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}>
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Device Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertTrendsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ day, alerts }) => `${day}: ${alerts}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="alerts"
                >
                {alertTrendsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#1976d2', '#2e7d32', '#ed6c02', '#dc004e', '#0288d1', '#757575', '#9c27b0'][index % 7]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
