import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Download, RefreshCw, Plus, Pencil, Trash2, Eye, Terminal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { deleteDevice, getAllDevices } from '@/services/deviceAction';
import useUpdateDeviceModal from '@/hooks/useUpdateDeviceModal';

export const DeviceListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: devices,
      isLoading,
    error,
  } = useQuery({
    queryKey: ["devices", currentPage, pageSize],
    queryFn: () => getAllDevices(currentPage, pageSize),
    staleTime: 0,
    refetchOnMount: "always",
  });
  console.log(devices)



  const { onOpen } = useAddDeviceModal();

 
  const deleteMutation = useMutation({
    mutationFn: deleteDevice,

    onSuccess: async () => {
      toast.success("Device deleted successfully");

      // Delay to allow the Kafka event to propagate from the user-management
      // service to the query service before refetching the device list.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["devices"],
      });
    },

    onError: () => {
      toast.error("Failed to delete device");
    },
  });
  const handleCreate = () => { setSelectedDevice(null); onOpen(); };
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

  const {setId,onOpen:onUpdateOpen}=useUpdateDeviceModal()

  const columns: ColumnDef<Device>[] = [

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
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return new Date(value).toLocaleString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const device = row.original;
        return (
          <div className="flex gap-1">

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(`/devices/${device.id}`)
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                   setId(device.id);
                   onUpdateOpen()
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>


              <AlertDialog>

                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>


                <AlertDialogContent>

                  <AlertDialogHeader>

                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      This will permanently delete{" "}
                      <span className="font-semibold">
                        {device.deviceName}
                      </span>.
                    </AlertDialogDescription>

                  </AlertDialogHeader>


                  <AlertDialogFooter>

                    <AlertDialogCancel
                      disabled={deleteMutation.isPending}
                    >
                      Cancel
                    </AlertDialogCancel>


                    <AlertDialogAction
                      disabled={deleteMutation.isPending}
                      className="bg-destructive"
                      onClick={() =>
                        deleteMutation.mutate(device.id)
                      }
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>


                  </AlertDialogFooter>

                </AlertDialogContent>

              </AlertDialog>
            </>


          </div>
        );
      },
    },
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
          <DataTable
            columns={columns}
            data={devices?.content || []}
            searchKey="name"
            searchPlaceholder="Search devices..."
            manualPagination
            pageCount={devices?.totalPages || 0}
            pagination={{ pageIndex: currentPage, pageSize }}
            onPaginationChange={(updater) => {
              const next =
                typeof updater === "function"
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
          /></CardContent>
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