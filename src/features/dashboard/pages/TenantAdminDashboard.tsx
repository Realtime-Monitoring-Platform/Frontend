import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Router, Bell, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';

 const TenantAdminDashboard = () => {
  const { data: kpisData, isLoading, error } = useQuery({
    queryKey: ['tenant-admin-dashboard'],
    queryFn: () => api.get('/tenant-admin/dashboard/kpis').then(res => res.data),
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
    { title: 'Total Teams', value: kpisData?.totalTeams ?? 0, icon: <Users className="h-5 w-5" />, color: '#1976d2' },
    { title: 'Total Users', value: kpisData?.totalUsers ?? 0, trend: 12, trendLabel: 'active today', icon: <Users className="h-5 w-5" />, color: '#2e7d32' },
    { title: 'Total Devices', value: kpisData?.totalDevices ?? 0, trend: '98%', trendLabel: 'online', icon: <Router className="h-5 w-5" />, color: '#0288d1' },
    { title: 'Active Alerts', value: kpisData?.activeAlerts ?? 0, trend: 2, trendLabel: 'critical', icon: <Bell className="h-5 w-5" />, color: '#dc004e' },
    { title: 'Command Success', value: '99.2%', trend: '24h', trendLabel: 'last 24 hours', icon: <CheckCircle className="h-5 w-5" />, color: '#2e7d32' },
  ];

  const alertTrendsData = [
    { day: 'Mon', critical: 2, warning: 5, info: 12 },
    { day: 'Tue', critical: 1, warning: 3, info: 8 },
    { day: 'Wed', critical: 3, warning: 7, info: 15 },
    { day: 'Thu', critical: 0, warning: 4, info: 10 },
    { day: 'Fri', critical: 2, warning: 6, info: 13 },
    { day: 'Sat', critical: 1, warning: 2, info: 5 },
    { day: 'Sun', critical: 0, warning: 1, info: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your tenant environment</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  {kpi.trend && (
                    <p className="text-xs text-muted-foreground">{kpi.trend} {kpi.trendLabel}</p>
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Alert Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alert Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="critical" fill="#dc004e" />
                <Bar dataKey="warning" fill="#ed6c02" />
                <Bar dataKey="info" fill="#0288d1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Health */}
        <Card>
          <CardHeader>
            <CardTitle>Device Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm">Healthy</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-4/5 rounded-full bg-green-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm">Warning</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-1/12 rounded-full bg-amber-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm">Critical</span>
                  <span className="font-semibold">5%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-1/24 rounded-full bg-destructive" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;
