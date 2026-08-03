import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import { mockAlertApi } from '@/services/mockApi';
import type { Alert as AlertType } from '@/types';
import toast from 'react-hot-toast';
// import { AlertActionForm, DeleteDialog } from '@/components/crud-forms';

export const AlertCenterPage = () => {
  const queryClient = useQueryClient();
  const [ackOpen, setAckOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => mockAlertApi.list(0, 50).then(res => res.content),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => mockAlertApi.acknowledge(id, 'current-user'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['alerts'] }); toast.success('Alert acknowledged'); setAckOpen(false); },
    onError: () => toast.error('Failed to acknowledge alert'),
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => mockAlertApi.resolve(id, 'current-user'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['alerts'] }); toast.success('Alert resolved'); setResolveOpen(false); },
    onError: () => toast.error('Failed to resolve alert'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mockAlertApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['alerts'] }); toast.success('Alert deleted'); setDeleteOpen(false); },
    onError: () => toast.error('Failed to delete alert'),
  });

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'WARNING': return 'warning';
      case 'INFO': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'destructive';
      case 'ACKNOWLEDGED': return 'warning';
      case 'RESOLVED': return 'success';
      default: return 'default';
    }
  };

  const columns: ColumnDef<AlertType>[] = [
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge >{value}</Badge>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge >{value}</Badge>;
      },
    },
    { accessorKey: 'deviceName', header: 'Device' },
    { accessorKey: 'message', header: 'Message' },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return new Date(value).toLocaleString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const alert = row.original;
        return (
          <div className="flex gap-1">
            {alert.status === 'ACTIVE' && (
              <Button size="sm" variant="ghost" onClick={() => { setSelectedAlert(alert); setAckOpen(true); }}>Acknowledge</Button>
            )}
            {alert.status !== 'RESOLVED' && (
              <Button size="sm" variant="ghost" onClick={() => { setSelectedAlert(alert); setResolveOpen(true); }}>Resolve</Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => { setSelectedAlert(alert); setDeleteOpen(true); }} className="text-destructive">Delete</Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <div className="flex h-96 w-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  if (error) return <Alert variant="destructive"><AlertDescription>Failed to load alerts</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alert Center</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage alerts</p>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={alerts || []} searchKey="deviceName" searchPlaceholder="Search alerts..." />
        </CardContent>
      </Card>

      {/* <AlertActionForm open={ackOpen} onOpenChange={setAckOpen} alert={selectedAlert} action="acknowledge" onSubmit={() => selectedAlert && acknowledgeMutation.mutate(selectedAlert.id)} isSubmitting={acknowledgeMutation.isPending} />
      <AlertActionForm open={resolveOpen} onOpenChange={setResolveOpen} alert={selectedAlert} action="resolve" onSubmit={() => selectedAlert && resolveMutation.mutate(selectedAlert.id)} isSubmitting={resolveMutation.isPending} />
      <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => selectedAlert && deleteMutation.mutate(selectedAlert.id)} isConfirming={deleteMutation.isPending} entityName={`alert "${selectedAlert?.message?.substring(0, 30)}..."`} /> */}

    </div>
  );
};