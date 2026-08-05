import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Router, Gauge, Network, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';

export const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    fetchDevice();
  }, [id]);

  const fetchDevice = async () => {
    try {
      const response = await api.get(`/devices/${id}`);
      setDevice(response.data);
    } catch (err) {
      setError('Failed to load device details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !device) {
    return <Alert variant="destructive"><AlertDescription>{error || 'Device not found'}</AlertDescription></Alert>;
  }

  const metricsData = [
    { time: '00:00', cpu: 45, ram: 62, disk: 71, temp: 58 },
    { time: '04:00', cpu: 38, ram: 58, disk: 71, temp: 55 },
    { time: '08:00', cpu: 65, ram: 75, disk: 73, temp: 62 },
    { time: '12:00', cpu: 78, ram: 82, disk: 75, temp: 68 },
    { time: '16:00', cpu: 72, ram: 78, disk: 74, temp: 65 },
    { time: '20:00', cpu: 55, ram: 68, disk: 72, temp: 60 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{device.name}</h1>
          <p className="text-sm text-muted-foreground">
            {device.deviceId} • {device.location}
          </p>
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
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">{device.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2 text-white">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-semibold">{device.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2 text-white">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="font-semibold">{device.ipAddress || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500 p-2 text-white">
                <Thermometer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Firmware</p>
                <p className="font-semibold">{device.firmwareVersion}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Device ID:</strong> {device.deviceId}</p>
                <p className="text-sm"><strong>Location:</strong> {device.location}</p>
                <p className="text-sm"><strong>Team:</strong> {device.teamName || 'N/A'}</p>
                <p className="text-sm"><strong>Last Seen:</strong> {new Date(device.lastSeen).toLocaleString()}</p>
                <p className="text-sm"><strong>Description:</strong> {device.description || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Metrics (Last 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="#1976d2" strokeWidth={2} name="CPU %" />
                  <Line type="monotone" dataKey="ram" stroke="#2e7d32" strokeWidth={2} name="RAM %" />
                  <Line type="monotone" dataKey="disk" stroke="#ed6c02" strokeWidth={2} name="Disk %" />
                  <Line type="monotone" dataKey="temp" stroke="#dc004e" strokeWidth={2} name="Temp °C" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
            <CardContent>
              <p className="text-sm text-muted-foreground">Command history will be implemented here</p>
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
      </Tabs>
    </div>
  );
};
