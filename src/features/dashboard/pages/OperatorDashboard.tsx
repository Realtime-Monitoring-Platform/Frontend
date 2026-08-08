import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';

export const OperatorDashboard = () => {
  const { data: alertCounts, isLoading, error } = useQuery({
    queryKey: ['operator-dashboard'],
    queryFn: () => api.get('/operator/dashboard/alert-summary').then(res => res.data),
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

  const alertVolumeData = [
    { time: '10:00', count: 5 },
    { time: '10:10', count: 8 },
    { time: '10:20', count: 3 },
    { time: '10:30', count: 12 },
    { time: '10:40', count: 6 },
    { time: '10:50', count: 9 },
    { time: '11:00', count: 4 },
  ];

  const criticalDevices = [
    { id: 1, name: 'Sensor Array A1', location: 'Building A, Floor 2', cpu: 92, temp: 91 },
    { id: 2, name: 'Gateway B2', location: 'Building B, Floor 1', cpu: 88, temp: 85 },
    { id: 3, name: 'Controller C3', location: 'Building C, Floor 3', cpu: 95, temp: 93 },
  ];

  const incidentTimeline = [
    { id: 1, time: '10:30', event: 'Alert triggered', device: 'Sensor Array A1', severity: 'critical' },
    { id: 2, time: '10:32', event: 'Acknowledged by John Doe', device: 'Sensor Array A1', severity: 'info' },
    { id: 3, time: '10:35', event: 'Assigned to Jane Smith', device: 'Sensor Array A1', severity: 'info' },
    { id: 4, time: '10:28', event: 'Alert triggered', device: 'Gateway B2', severity: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Operator Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor active alerts and device status</p>
      </div>

      {/* Alert Summary Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-destructive text-destructive-foreground">
              <Bell className="mr-1 h-3 w-3" />
              Critical: {alertCounts?.critical || 3}
            </Badge>
            <Badge className="bg-amber-500 text-white">
              <Bell className="mr-1 h-3 w-3" />
              Warning: {alertCounts?.warning || 8}
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Bell className="mr-1 h-3 w-3" />
              Info: {alertCounts?.info || 12}
            </Badge>
            <Badge variant="secondary">
              <Bell className="mr-1 h-3 w-3" />
              Acknowledged: {alertCounts?.acknowledged || 15}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Monitoring */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Alert Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Volume (Last Hour)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#dc004e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalDevices.map((device) => (
                <div
                  key={device.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{device.location}</p>
                  <div className="mt-1 flex gap-3 text-xs">
                    <span>CPU: {device.cpu}%</span>
                    <span>Temp: {device.temp}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incident Timeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Incident Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentTimeline.map((incident) => (
                <div key={incident.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div
                    className="mt-1 h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        incident.severity === 'critical'
                          ? '#dc004e'
                          : incident.severity === 'warning'
                          ? '#ed6c02'
                          : '#0288d1',
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{incident.event}</span>
                      <span className="text-xs text-muted-foreground">{incident.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{incident.device}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
