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
import { useQuery } from '@tanstack/react-query';
import { getDeviceById } from '@/services/deviceAction';

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
  const {data:deviceDetails} = useQuery({
    queryKey: ['deviceDetails', id],
    queryFn: ()=>getDeviceById(id || ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  console.log('Device Details:', deviceDetails);
  
  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{deviceDetails?.deviceName || 'Device Details'}</h1>
          <p className="text-sm text-muted-foreground">{deviceDetails?.model || 'No model specified'}</p>
        </div>
        <div className="flex gap-2">
          {/* 
          <Button variant="outline" onClick={() => navigate(`/devices/${id}/edit`)}>
            Edit
          </Button>
          <Button onClick={() => navigate(`/devices/${id}/commands`)}>
            Send Command
          </Button> 
          */}
        </div>
      </div>

      {/* Stats Cards */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2 text-white">
                <Router className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    // deviceDetails?.status === '' ? 'bg-green-100 text-green-700' :
                    // deviceDetails?.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' :
                    // deviceDetails?.status === 'ERROR' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {deviceDetails?.status || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2 text-white">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hostname</p>
                <p className="font-semibold">{deviceDetails?.hostname || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2 text-white">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="font-semibold">{deviceDetails?.ipAddress || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500 p-2 text-white">
                <Thermometer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MAC Address</p>
                <p className="font-semibold">{deviceDetails?.macAddress || 'N/A'}</p>
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
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">General Information</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Device ID:</strong> {deviceDetails?.id || 'N/A'}</p>
                        <p className="text-sm"><strong>Device Name:</strong> {deviceDetails?.deviceName || 'N/A'}</p>
                        <p className="text-sm"><strong>Description:</strong> {deviceDetails?.description || 'No description'}</p>
                        <p className="text-sm"><strong>Location:</strong> {deviceDetails?.location || 'N/A'}</p>
                        <p className="text-sm"><strong>Device Identifier:</strong> {deviceDetails?.deviceIdentifier || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Hardware Information</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Manufacturer:</strong> {deviceDetails?.manufacturer || 'N/A'}</p>
                        <p className="text-sm"><strong>Model:</strong> {deviceDetails?.model || 'N/A'}</p>
                        <p className="text-sm"><strong>CPU Count:</strong> {deviceDetails?.cpuCount ?? 'N/A'}</p>
                        <p className="text-sm"><strong>Total Memory:</strong> {deviceDetails?.totalMemoryKb ? `${(deviceDetails.totalMemoryKb / 1024 / 1024).toFixed(2)} GB` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Network Information</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Hostname:</strong> {deviceDetails?.hostname || 'N/A'}</p>
                        <p className="text-sm"><strong>IP Address:</strong> {deviceDetails?.ipAddress || 'N/A'}</p>
                        <p className="text-sm"><strong>MAC Address:</strong> {deviceDetails?.macAddress || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Operating System</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>OS Name:</strong> {deviceDetails?.osName || 'N/A'}</p>
                        <p className="text-sm"><strong>OS Version:</strong> {deviceDetails?.osVersion || 'N/A'}</p>
                        <p className="text-sm"><strong>Kernel Version:</strong> {deviceDetails?.kernelVersion || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignment Information</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Team:</strong> {deviceDetails?.teamName || 'N/A'}</p>
                        <p className="text-sm"><strong>Tenant:</strong> {deviceDetails?.tenantName || 'N/A'}</p>
                        <p className="text-sm"><strong>Assigned User:</strong> {deviceDetails?.assignedUserName || 'Unassigned'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Timestamps</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Last Seen:</strong> {deviceDetails?.lastSeen ? new Date(deviceDetails.lastSeen).toLocaleString() : 'Never'}</p>
                        <p className="text-sm"><strong>Created At:</strong> {deviceDetails?.createdAt ? new Date(deviceDetails.createdAt).toLocaleString() : 'N/A'}</p>
                        <p className="text-sm"><strong>Updated At:</strong> {deviceDetails?.updatedAt ? new Date(deviceDetails.updatedAt).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            {id && (
              <DeviceMetrics id={id} />
            )}
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Device Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {id && (
                  <DeviceLogs deviceId={id} />
                )}
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