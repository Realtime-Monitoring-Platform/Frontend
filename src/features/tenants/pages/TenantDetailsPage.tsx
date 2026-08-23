import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Users, Group, Router, Building } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Tenant, User, Team, Device } from '@/types';
import { getTenantById } from '@/services/tenantAction';
import { getUsersByTenantId } from '@/services/usersAction';
import { getAllTeamsByTeanntId } from '@/services/teamsAction';
import { getAllDeviceBytenanntId } from '@/services/deviceAction';

const userColumns: ColumnDef<User>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'username', header: 'Username' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <Badge>{value}</Badge>;
    },
  },
];

const teamColumns: ColumnDef<Team>[] = [
  { accessorKey: 'name', header: 'Team Name' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'userNumber', header: 'Members' },
  { accessorKey: 'teamLeaderName', header: 'Team Lead' },
  { accessorKey: 'deviceCount', header: 'Devices' },
];

const deviceColumns: ColumnDef<Device>[] = [
  { accessorKey: 'deviceName', header: 'Name' },
  { accessorKey: 'hostname', header: 'Hostname' },
  { accessorKey: 'ipAddress', header: 'IP Address' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <Badge>{value}</Badge>;
    },
  },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'model', header: 'Model' },
];
const UsersTable = ({ tenantId }: { tenantId: string }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenant-users', tenantId, currentPage, pageSize],
    queryFn: () => getUsersByTenantId(tenantId, currentPage, pageSize),
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: !!tenantId,
  });

  if (isLoading)
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load users</AlertDescription>
      </Alert>
    );

  return (
    <DataTable
      columns={userColumns}
      data={users?.content || []}
      searchKey="username"
      searchPlaceholder="Search users..."
      manualPagination
      pageCount={users?.totalPages || 0}
      pagination={{ pageIndex: currentPage, pageSize }}
      onPaginationChange={(updater) => {
        const next =
          typeof updater === 'function'
            ? updater({ pageIndex: currentPage, pageSize })
            : updater;
        setCurrentPage(next.pageIndex);
      }}
      totalElements={users?.totalElements || 0}
      pageSizeOptions={[5, 10, 20, 50]}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(0);
      }}
    />
  );
};
const TeamsTable = ({ tenantId }: { tenantId: string }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: teams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenant-teams', tenantId, currentPage, pageSize],
    queryFn: () => getAllTeamsByTeanntId(tenantId, currentPage, pageSize),
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: !!tenantId,
  });

  if (isLoading)
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load teams</AlertDescription>
      </Alert>
    );

  return (
    <DataTable
      columns={teamColumns}
      data={teams?.content || []}
      searchKey="name"
      searchPlaceholder="Search teams..."
      manualPagination
      pageCount={teams?.totalPages || 0}
      pagination={{ pageIndex: currentPage, pageSize }}
      onPaginationChange={(updater) => {
        const next =
          typeof updater === 'function'
            ? updater({ pageIndex: currentPage, pageSize })
            : updater;
        setCurrentPage(next.pageIndex);
      }}
      totalElements={teams?.totalElements || 0}
      pageSizeOptions={[5, 10, 20, 50]}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(0);
      }}
    />
  );
};
const DevicesTable = ({ tenantId }: { tenantId: string }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: devices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenant-devices', tenantId, currentPage, pageSize],
    queryFn: () => getAllDeviceBytenanntId(tenantId, currentPage, pageSize),
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: !!tenantId,
  });

  if (isLoading)
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load devices</AlertDescription>
      </Alert>
    );

  return (
    <DataTable
      columns={deviceColumns}
      data={devices?.content || []}
      searchKey="deviceName"
      searchPlaceholder="Search devices..."
      manualPagination
      pageCount={devices?.totalPages || 0}
      pagination={{ pageIndex: currentPage, pageSize }}
      onPaginationChange={(updater) => {
        const next =
          typeof updater === 'function'
            ? updater({ pageIndex: currentPage, pageSize })
            : updater;
        setCurrentPage(next.pageIndex);
      }}
      totalElements={devices?.totalElements || 0}
      pageSizeOptions={[5, 10, 20, 50]}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(0);
      }}
    />
  );
};
const statCards = [
  { key: 'userNumber', label: 'Users', icon: <Users className="h-5 w-5" /> },
  { key: 'teamNumber', label: 'Teams', icon: <Group className="h-5 w-5" /> },
  { key: 'deviceNumber', label: 'Devices', icon: <Router className="h-5 w-5" /> },
] as const;
const TenantDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: tenant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenantById(id || ''),
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  if (error || !tenant)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load tenant details</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" aria-label="Back to tenants" onClick={() => navigate('/tenants')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building className="h-6 w-6" />
              {tenant.name}
              <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'outline'}>{tenant.status}</Badge>
            </h1>
            <p className="text-sm text-muted-foreground">{tenant.companyName}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Overview</CardTitle>
          <CardDescription>Details and resource usage for this tenant</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="text-sm">
            <div className="font-medium">Contact Email</div>
            <div className="text-muted-foreground">{tenant.email}</div>
          </div>
          {tenant.phone && (
            <div className="text-sm">
              <div className="font-medium">Phone</div>
              <div className="text-muted-foreground">{tenant.phone}</div>
            </div>
          )}
          <div className="text-sm">
            <div className="font-medium">Created At</div>
            <div className="text-muted-foreground">
              {new Date(tenant.createdAt).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="flex items-center justify-between  ">
              <CardTitle className="text-lg flex items-center justify-between">
                <p> {card.icon}</p> <p className="ml-3 text-lg">  {card.label}</p>
                 
                 </CardTitle>
              
            </CardHeader>
            <CardContent>
              <p className="text-3xl flex justify-center font-bold">{tenant[card.key] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="users" className="flex flex-col">
        <div>
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
        </div>
        <div>
          <TabsContent value="users">
            <Card>
              <CardContent>
                <UsersTable tenantId={tenant.id} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="teams">
            <Card>
              <CardContent>
                <TeamsTable tenantId={tenant.id} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="devices">
            <Card>
              <CardContent>
                <DevicesTable tenantId={tenant.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TenantDetailsPage;