import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';
import { mockDeviceMetrics, mockDevices } from '@/services/mockData';

 const MonitoringPage = () => {
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
  //  fetchDevices();
  }, []);

  // const fetchDevices = async () => {
  //   try {
  //     const response = await api.get('/monitoring/devices');
  //     setDevices(response.data || []);
  //   } catch (err) {
  //     setError('Failed to load monitoring data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'success';
      case 'OFFLINE': return 'default';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'destructive';
      default: return 'default';
    }
  };

  const performanceData = [
    { time: '00:00', cpu: 45, ram: 62, disk: 71 },
    { time: '04:00', cpu: 38, ram: 58, disk: 71 },
    { time: '08:00', cpu: 65, ram: 75, disk: 73 },
    { time: '12:00', cpu: 78, ram: 82, disk: 75 },
    { time: '16:00', cpu: 72, ram: 78, disk: 74 },
    { time: '20:00', cpu: 55, ram: 68, disk: 72 },
  ];

  // if (loading) {
  //   return (
  //     <div className="flex h-96 w-full items-center justify-center">
  //       <Spinner className="h-8 w-8" />
  //     </div>
  //   );
  // }

  if (error) {
    return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
        <p className="text-sm text-muted-foreground">Monitor all devices in real-time</p>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance (Last 24h)</CardTitle>
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

      {/* Device Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockDeviceMetrics.map((device:any) => (
          <Card key={device.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.deviceId}</p>
                </div>
                <Badge >
                  {device.status}
                </Badge>
              </div>

              <div className="space-y-2 mt-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span>CPU</span>
                    <span className="font-semibold">{device.metrics?.cpu || 0}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${device.metrics?.cpu || 0}%`,
                        backgroundColor: device.metrics?.cpu > 80 ? '#dc004e' : '#1976d2',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span>RAM</span>
                    <span className="font-semibold">{device.metrics?.ram || 0}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${device.metrics?.ram || 0}%`,
                        backgroundColor: device.metrics?.ram > 80 ? '#dc004e' : '#2e7d32',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span>Temperature</span>
                    <span className="font-semibold">{device.metrics?.temperature || 0}°C</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${device.metrics?.temperature || 0}%`,
                        backgroundColor: device.metrics?.temperature > 80 ? '#dc004e' : '#ed6c02',
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                Last updated: {new Date(device.lastUpdated || Date.now()).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};


export default MonitoringPage;