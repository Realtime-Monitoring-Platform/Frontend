import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Building, Users, Router, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';

export const PlatformAdminDashboard = () => {
  const { data: kpisData, isLoading, error } = useQuery({
    queryKey: ['platform-dashboard-kpis'],
    queryFn: () => api.get('/platform-admin/dashboard/kpis').then(res => res.data),
    retry: 1,
  });

  const { data: growthData } = useQuery({
    queryKey: ['platform-tenant-growth'],
    queryFn: () => api.get('/platform-admin/dashboard/tenant-growth').then(res => res.data),
    retry: 1,
  });

  const { data: statusData } = useQuery({
    queryKey: ['platform-device-status'],
    queryFn: () => api.get('/platform-admin/dashboard/device-status').then(res => res.data),
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
    { title: 'Total Tenants', value: kpisData?.totalTenants ?? 0, trend: 3, trendLabel: 'this month', icon: <Building className="h-5 w-5" />, color: '#1976d2' },
    { title: 'Total Users', value: kpisData?.totalUsers?.toLocaleString() ?? '0', trend: 89, trendLabel: 'this month', icon: <Users className="h-5 w-5" />, color: '#2e7d32' },
    { title: 'Active Devices', value: kpisData?.activeDevices?.toLocaleString() ?? '0', trend: 98.2, trendLabel: '% uptime', icon: <Router className="h-5 w-5" />, color: '#0288d1' },
    { title: 'Offline Devices', value: kpisData?.offlineDevices ?? 0, trend: -12, trendLabel: '% from last week', icon: <Router className="h-5 w-5" />, color: '#ed6c02' },
    { title: 'Active Alerts', value: kpisData?.activeAlerts ?? 0, trend: 5, trendLabel: 'critical', icon: <Bell className="h-5 w-5" />, color: '#dc004e' },
  ];

  const COLORS = ['#2e7d32', '#ed6c02', '#dc004e', '#757575'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-sm text-muted-foreground">Global overview of your IoT platform</p>
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
                  {kpi.trend !== undefined && (
                    <div className="mt-1 flex items-center gap-1">
                      <TrendingUp
                        className="h-4 w-4"
                        style={{
                          color: kpi.trend > 0 ? '#2e7d32' : '#dc004e',
                          transform: kpi.trend < 0 ? 'rotate(180deg)' : 'none',
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.abs(kpi.trend)} {kpi.trendLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}
                >
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tenant Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tenant Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(statusData || []).map((item: any, index: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
