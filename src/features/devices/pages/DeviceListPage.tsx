
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Download,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Server,
  Wifi,
  Search,
  Filter,
  Cpu,
  MemoryStick,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Router,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';

import type { Device } from '@/types';
import toast from 'react-hot-toast';
import useAddDeviceModal from '@/hooks/useAddDeviceModal';
import useUpdateDeviceModal from '@/hooks/useUpdateDeviceModal';
import {
  deleteDevice,
  getAllDeviceBytenanntId,
  getAllDevices,
} from '@/services/deviceAction';
import { useAuth } from '@/hooks/useAuth';

const DeviceListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const fetchDevices = () => {
    if (user?.role !== 'PLATFORM_ADMIN') {
      return getAllDeviceBytenanntId(
        user?.tenantId || '',
        currentPage,
        pageSize
      );
    }

    return getAllDevices(currentPage, pageSize);
  };

  const {
    data: devices,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['devices', user?.role, user?.tenantId, currentPage, pageSize],
    queryFn: fetchDevices,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
  console.log(devices);
  const allDevices: Device[] = devices?.content ?? [];

  // The extra fields are optional because their availability depends
  // on the Device model returned by your backend.
  const getStatus = (device: Device) =>
    String((device as any).status ?? 'UNKNOWN').toUpperCase();

  const getTeam = (device: Device) => {
    const d = device as any;
    return d.teamName ?? d.team?.name ?? d.team ?? 'Unassigned';
  };

  const getModel = (device: Device) => {
    const d = device as any;
    return d.model ?? d.deviceModel ?? '—';
  };

  const filteredDevices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allDevices.filter((device) => {
      const d = device as any;

      const matchesSearch =
        !query ||
        [
          d.deviceName,
          d.hostname,
          d.id,
          d.ipAddress,
          getModel(device),
          getTeam(device),
        ].some((value) => String(value ?? '').toLowerCase().includes(query));

      const status = getStatus(device);
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ONLINE' &&
          ['ONLINE', 'ACTIVE'].includes(status)) ||
        (statusFilter === 'WARNING' &&
          ['WARNING', 'MAINTENANCE'].includes(status)) ||
        (statusFilter === 'OFFLINE' &&
          ['OFFLINE', 'DISCONNECTED', 'INACTIVE'].includes(status));

      const matchesTeam =
        teamFilter === 'ALL' ||
        String(getTeam(device)) === teamFilter;

      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [allDevices, search, statusFilter, teamFilter]);

  const onlineCount = allDevices.filter((device) =>
    ['ONLINE', 'ACTIVE'].includes(getStatus(device))
  ).length;

  const warningCount = allDevices.filter((device) =>
    ['WARNING', 'MAINTENANCE'].includes(getStatus(device))
  ).length;

  const offlineCount = allDevices.filter((device) =>
    ['OFFLINE', 'DISCONNECTED', 'INACTIVE'].includes(getStatus(device))
  ).length;

  const teams = [...new Set(allDevices.map(getTeam))]
    .filter((team) => team !== 'Unassigned')
    .sort();

  const { onOpen } = useAddDeviceModal();
  const { setId, onOpen: onUpdateOpen } = useUpdateDeviceModal();

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: async () => {
      toast.success('Device deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: () => {
      toast.error('Failed to delete device');
    },
  });

  const statusStyle = (status: string) => {
    if (['ONLINE', 'ACTIVE'].includes(status)) {
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    }

    if (['WARNING', 'MAINTENANCE'].includes(status)) {
      return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    }

    if (['OFFLINE', 'DISCONNECTED', 'INACTIVE'].includes(status)) {
      return 'border-slate-400/30 bg-slate-500/10 text-slate-500';
    }

    return 'border-border bg-muted text-muted-foreground';
  };

 

  

  const totalElements = Number(devices?.totalElements ?? allDevices.length);
  const totalPages = Number(devices?.totalPages ?? 1);
  const start = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="min-w-0 space-y-6 pb-8">
      {/* Page heading */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.09] via-background to-background px-5 py-6 sm:px-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-500/[0.08] blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Activity className="h-4 w-4 text-cyan-500" />
              Fleet management
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Devices
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Manage and monitor your embedded Linux devices, connectivity,
              and fleet health from one place.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh devices"
              aria-label="Refresh devices"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
              />
            </Button>

            <Button variant="outline" onClick={() => {
              toast('Connect this button to your device export endpoint.');
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button
              onClick={onOpen}
              className="bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add device
            </Button>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Total devices"
          value={totalElements}
          icon={<Server className="h-5 w-5" />}
          tone="cyan"
        />

        <SummaryCard
          label="Online"
          value={onlineCount}
          icon={<Wifi className="h-5 w-5" />}
          tone="green"
        />

        <SummaryCard
          label="Warning"
          value={warningCount}
          icon={<Activity className="h-5 w-5" />}
          tone="amber"
        />

        <SummaryCard
          label="Offline"
          value={offlineCount}
          icon={<Router className="h-5 w-5" />}
          tone="slate"
        />
      </section>

      {/* Filters */}
      <section className="rounded-xl border bg-card p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search device name, ID, model, or IP..."
              aria-label="Search devices"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            >
              <option value="ALL">All statuses</option>
              <option value="ONLINE">Online</option>
              <option value="WARNING">Warning</option>
              <option value="OFFLINE">Offline</option>
            </select>

            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => setShowMoreFilters((value) => !value)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {showMoreFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Team
              <select
                value={teamFilter}
                onChange={(event) => setTeamFilter(event.target.value)}
                className="h-9 max-w-56 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="ALL">All teams</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setTeamFilter('ALL');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredDevices.length}</strong> devices on this page
          </span>

          {search || statusFilter !== 'ALL' || teamFilter !== 'ALL' ? (
            <span className="text-cyan-600 dark:text-cyan-400">
              Filters applied
            </span>
          ) : null}
        </div>
      </section>

      {/* Inventory table */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold">Device inventory</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Device identity, status, team, and resource usage
            </p>
          </div>

          {isFetching && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating devices...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Device</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Model</th>
                <th className="px-4 py-3.5 font-medium">Team</th>
                <th className="px-4 py-3.5 font-medium">CPU Count</th>
                <th className="px-4 py-3.5 font-medium">Memory</th>
                <th className="px-4 py-3.5 font-medium">IP Address</th>
                <th className="px-4 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/70">
              {filteredDevices.map((device) => {
                const d = device as any;
                const status = getStatus(device);
               

                return (
                  <tr
                    key={device.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/devices/${device.id}`)}
                        className="flex max-w-64 items-center gap-3 text-left"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-hover:border-cyan-500/30 group-hover:text-cyan-600">
                          <Router className="h-4 w-4" />
                        </span>

                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-foreground hover:text-cyan-600">
                            {d.deviceName || d.hostname || 'Unnamed device'}
                          </span>
                          <span className="mt-1 block truncate font-mono text-[11px] text-muted-foreground">
                            {d.id}
                          </span>
                        </span>
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={`gap-1.5 whitespace-nowrap font-medium ${statusStyle(status)}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">
                      {getModel(device)}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">
                      {getTeam(device)}
                    </td>

                    <td className="px-4 py-4">
                      {device.cpuCount} 
                      {/* <UsageBar value={cpu} icon={<Cpu className="h-3.5 w-3.5" />} /> */}
                    </td>

                    <td className="px-4 py-4">
                      {device?.totalMemoryKb
                        ? (device.totalMemoryKb / 1024 / 1024 / 1024).toFixed(2)
                        : '0.00'} GB                    {/* <UsageBar value={(device?.totalMemoryKb ? device.totalMemoryKb / 1024 / 1024 : 0)} icon={<MemoryStick className="h-3.5 w-3.5" />} /> */}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">

                      {device.ipAddress || "No IP address"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View device"
                          aria-label={`View ${d.deviceName ?? 'device'}`}
                          onClick={() => navigate(`/devices/${device.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Edit device"
                          aria-label={`Edit ${d.deviceName ?? 'device'}`}
                          onClick={() => {
                            setId(device.id);
                            onUpdateOpen();
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-destructive/10"
                              title="Delete device"
                              aria-label={`Delete ${d.deviceName ?? 'device'}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this device?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This will permanently delete{' '}
                                <strong>
                                  {d.deviceName || d.hostname || 'this device'}
                                </strong>
                                . This action cannot be undone.
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
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={(event) => {
                                  event.preventDefault();
                                  deleteMutation.mutate(device.id);
                                }}
                              >
                                {deleteMutation.isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Delete device
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="hidden h-8 w-8"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!filteredDevices.length && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </span>

                    <p className="font-medium">
                      No devices found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Try changing your search or filters.
                    </p>

                    {(search || statusFilter !== 'ALL' || teamFilter !== 'ALL') && (
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearch('');
                          setStatusFilter('ALL');
                          setTeamFilter('ALL');
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{start}–{end}</strong> of{' '}
            <strong className="text-foreground">{totalElements}</strong> devices
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <label className="mr-1 flex items-center gap-2 text-xs text-muted-foreground">
              Rows
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(0);
                }}
                className="h-8 rounded-md border border-input bg-background px-2 text-foreground"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 0 || isFetching}
              onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <span className="min-w-16 text-center text-xs text-muted-foreground">
              {currentPage + 1} / {Math.max(1, totalPages)}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage + 1 >= totalPages || isFetching}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages - 1, page + 1))
              }
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'cyan' | 'green' | 'amber' | 'slate';
}) {
  const tones = {
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    slate: 'bg-slate-500/10 text-slate-500',
  };

  return (
    <div className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/20 sm:p-5">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </span>

        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function UsageBar({
  value,
  icon,
}: {
  value: number | null;
  icon: React.ReactNode;
}) {
  if (value === null) {
    return <span className="text-xs text-muted-foreground">N/A</span>;
  }

  const barTone =
    value >= 85
      ? 'bg-rose-500'
      : value >= 65
        ? 'bg-amber-500'
        : 'bg-cyan-500';

  return (
    <div className="w-24">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${barTone}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default DeviceListPage;
