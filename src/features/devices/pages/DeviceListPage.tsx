import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Download, RefreshCw, Plus, Pencil, Trash2, Eye, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import type { Device } from '@/types';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useAddDeviceModal from '@/hooks/useAddDeviceModal';

export const DeviceListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // const { data: devices, isLoading, error, refetch } = useQuery({
  //   queryKey: ['devices'],
  //   queryFn: () => mockDeviceApi.list(0, 50).then(res => res.content),
  // });

  // const { data: teams = [] } = useQuery({
  //   queryKey: ['teams-for-device-form'],
  //   queryFn: () => mockTeamApi.list(0, 50).then(res => res.content),
  // });

  const { onOpen } = useAddDeviceModal();

  // const createMutation = useMutation({
  //   mutationFn: (data: Partial<Device>) => mockDeviceApi.create(data),
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['devices'] }); toast.success('Device created successfully'); setFormOpen(false); },
  //   onError: () => toast.error('Failed to create device'),
  // });

  // const updateMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<Device> }) => mockDeviceApi.update(id, data),
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['devices'] }); toast.success('Device updated successfully'); setFormOpen(false); },
  //   onError: () => toast.error('Failed to update device'),
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: (id: string) => mockDeviceApi.delete(id),
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['devices'] }); toast.success('Device deleted successfully'); setDeleteOpen(false); },
  //   onError: () => toast.error('Failed to delete device'),
  // });

  const handleCreate = () => { setSelectedDevice(null); onOpen(); };
  const handleEdit = (device: Device) => { setSelectedDevice(device); setFormOpen(true); };
  const handleDelete = (device: Device) => { setSelectedDevice(device); setDeleteOpen(true); };
  // const handleSubmit = (data: Partial<Device>) => {
  //   if (selectedDevice) updateMutation.mutate({ id: selectedDevice.id, data });
  //   else createMutation.mutate(data);
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

  const columns: ColumnDef<Device>[] = [
    { accessorKey: 'name', header: 'Device Name' },
    { accessorKey: 'deviceId', header: 'Device ID' },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge>{value}</Badge>;
      },
    },
    { accessorKey: 'location', header: 'Location' },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return new Date(value).toLocaleString();
      },
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: ({ row }) => (
    //     <div className="flex gap-1">
    //       <Button size="sm" variant="ghost" onClick={() => navigate(`/devices/${row.original.id}`)}><Eye className="h-4 w-4" /></Button>
    //       <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
    //       <Button size="sm" variant="ghost" onClick={() => navigate(`/devices/${row.original.id}/commands`)}><Terminal className="h-4 w-4" /></Button>
    //       <AlertDialog >
    //           <AlertDialogTrigger render={<Button variant="outline"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
    //           <AlertDialogContent>
    //             <AlertDialogHeader>
    //               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //               <AlertDialogDescription>
    //                 This action cannot be undone. This will permanently delete the tenant.
    //               </AlertDialogDescription>
    //             </AlertDialogHeader>
    //             <AlertDialogFooter>
    //               <AlertDialogCancel>Cancel</AlertDialogCancel>
    //               <AlertDialogAction onClick={() => handleDelete(row.original)}>Continue</AlertDialogAction>
    //             </AlertDialogFooter>
    //           </AlertDialogContent>
    //         </AlertDialog>
    //     </div>
    //   ),
    // },
  ];

  // if (isLoading) return <div className="flex h-96 w-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  // if (error) return <Alert variant="destructive"><AlertDescription>Failed to load devices</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor your devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" ><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" />Register Device</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* <DataTable columns={columns} data={devices || []} searchKey="name" searchPlaceholder="Search devices by name, ID, or location..." /> */}
        </CardContent>
      </Card>

      {/* <DeviceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        device={selectedDevice}
        teams={teams}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      /> */}

      {/* <DeleteDialog

        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => selectedDevice && deleteMutation.mutate(selectedDevice.id)}
        isConfirming={deleteMutation.isPending}
        entityName={selectedDevice?.name}
      /> */}
    </div>
  );
};