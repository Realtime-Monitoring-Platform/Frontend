import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Activity, Download, RefreshCw, Plus, Pencil, Trash2, Eye, Loader2, Server, Wifi } from 'lucide-react';
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
import { deleteDevice, getAllDeviceBytenanntId, getAllDevices } from '@/services/deviceAction';
import useUpdateDeviceModal from '@/hooks/useUpdateDeviceModal';
import { useAuth } from '@/hooks/useAuth';

const DeviceListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { user } = useAuth();
  const fetchDevices = () => {
    if (user?.role !== "PLATFORM_ADMIN") {
      return getAllDeviceBytenanntId(user?.tenantId || '', currentPage, pageSize);
    }

    return getAllDevices(currentPage, pageSize);
  }

  const {
    data: devices,
    isFetching,
    refetch,

  } = useQuery({
    queryKey: ["devices", currentPage, pageSize],
    queryFn: fetchDevices,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 10,
  });
  const visibleDevices = devices?.content || [];
  const onlineCount = visibleDevices.filter((device) =>
    ['ONLINE', 'ACTIVE'].includes(String(device.status).toUpperCase())
  ).length;
  const attentionCount = visibleDevices.filter((device) =>
    ['WARNING', 'MAINTENANCE', 'DISCONNECTED', 'OFFLINE'].includes(String(device.status).toUpperCase())
  ).length;

  const { onOpen } = useAddDeviceModal();

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,

    onSuccess: async () => {
      toast.success("Device deleted successfully");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["devices"],
      });
    },

    onError: () => {
      toast.error("Failed to delete device");
    },
  });
  const handleCreate = () => { onOpen(); };



  const { setId, onOpen: onUpdateOpen } = useUpdateDeviceModal()

  const columns: ColumnDef<Device>[] = [

    {
      accessorKey: 'deviceName', header: 'Name',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value || 'N/A'
      }
    },
    {
      accessorKey: 'hostname', header: 'Hostname',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value || 'N/A'
      }
    },
    {
      accessorKey: 'ipAddress', header: 'IP Address',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value || 'N/A';
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const normalized = value?.toUpperCase();
        const statusClass = normalized === 'ONLINE' || normalized === 'ACTIVE'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : normalized === 'WARNING' || normalized === 'MAINTENANCE'
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-slate-200 bg-slate-50 text-slate-600';
        return (
          <Badge variant="outline" className={`gap-1.5 ${statusClass}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {value || 'UNKNOWN'}
          </Badge>
        );
      },
    },

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
              aria-label={`Delete device ${device.deviceName}`}
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
                aria-label={`Update device ${device.deviceName}`}
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
                    aria-label={`Delete device ${device.deviceName}`}
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
    <div className="space-y-6 pb-8">
      <div className="relative overflow-hidden rounded-xl border border-[#82C8E5]/60 bg-[#82C8E5]/[0.08] px-5 py-6 shadow-sm sm:px-7">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#82C8E5]/30 to-transparent" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-[#3F819C]" />
              Fleet overview
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Devices</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monitor connectivity, health, and device activity.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              aria-label="Refresh devices"
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
            <Button aria-label="Export devices" variant="outline">
              <Download className="mr-2 h-4 w-4" />Export
            </Button>
            <Button aria-label="Register device" className="bg-[#82C8E5] text-[#163847] hover:bg-[#6FB7D5]" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />Register Device
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="rounded-lg bg-[#82C8E5]/25 p-2.5 text-[#3F819C]"><Server className="h-4 w-4" /></span>
            <div><p className="text-xs text-muted-foreground">Visible devices</p><p className="mt-0.5 text-xl font-semibold">{visibleDevices.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600"><Wifi className="h-4 w-4" /></span>
            <div><p className="text-xs text-muted-foreground">Online now</p><p className="mt-0.5 text-xl font-semibold">{onlineCount}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="rounded-lg bg-amber-50 p-2.5 text-amber-600"><Activity className="h-4 w-4" /></span>
            <div><p className="text-xs text-muted-foreground">Needs attention</p><p className="mt-0.5 text-xl font-semibold">{attentionCount}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={visibleDevices}
            searchKey="deviceName"
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
          />
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


export default DeviceListPage;