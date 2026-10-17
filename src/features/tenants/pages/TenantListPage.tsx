
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Search,
  Users,
  Monitor,
  Layers3,
  CheckCircle2,
  Download,
  SlidersHorizontal,
  X,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Tenant } from '@/types';
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
} from '@/components/ui/alert-dialog';
import {
  getAllTenants,
  createTenant,
  deleteTenant,
} from '@/services/tenantAction';
import useAddTenantModal from '@/hooks/useAddTenantModal';
import useUpdateTeanntModal from '@/hooks/useUpdateTeanntModal';
import { useAuth } from '@/hooks/useAuth';

const TenantListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const {
    data: tenants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenants', currentPage, pageSize],
    queryFn: () => getAllTenants(currentPage, pageSize),
  });

  const { onOpen } = useAddTenantModal();
  const { hasPermission } = useAuth();
  const { setId, onOpen: onUpdateOpen } = useUpdateTeanntModal();

  const canCreate = hasPermission('TENANT_CREATE');
  const canUpdate = hasPermission('TENANT_UPDATE');
  const canDelete = hasPermission('TENANT_DELETE');

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant created successfully');
      setFormOpen(false);
    },
    onError: () => toast.error('Failed to create tenant'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant deleted successfully');
    },
    onError: () => toast.error('Failed to delete tenant'),
  });

  const handleCreate = () => {
    setSelectedTenant(null);
    onOpen();
  };

  const columns: ColumnDef<Tenant>[] = [
    {
      accessorKey: 'name',
      header: 'Tenant',
      cell: ({ row }) => {
        const tenant = row.original;

        return (
          <button
            type="button"
            onClick={() => navigate(`/tenants/${tenant.id}`)}
            className="group flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 transition-colors group-hover:bg-primary/10">
              <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground transition-colors group-hover:text-primary">
                {tenant.name}
              </p>
              {/* <p className="max-w-[220px] truncate font-mono text-xs text-muted-foreground">
                {tenant.id}
              </p> */}
            </div>
          </button>
        );
      },
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.companyName || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.email || '—'}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.phone || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'userNumber',
      header: 'Users',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          {row.original.userNumber ?? 0}
        </span>
      ),
    },
    {
      accessorKey: 'deviceNumber',
      header: 'Devices',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 text-sm">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          {row.original.deviceNumber ?? 0}
        </span>
      ),
    },
    {
      accessorKey: 'teamNumber',
      header: 'Teams',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 text-sm">
          <Layers3 className="h-4 w-4 text-muted-foreground" />
          {row.original.teamNumber ?? 0}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const active = row.original.status === 'ACTIVE';

        return (
          <Badge
            variant="outline"
            className={
              active
                ? 'gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                : 'gap-1.5 border-border bg-muted/50 text-muted-foreground'
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-muted-foreground'
                }`}
            />
            {row.original.status || 'UNKNOWN'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const tenant = row.original;

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              aria-label={`View ${tenant.name}`}
              title="View tenant"
              onClick={() => navigate(`/tenants/${tenant.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              aria-label={`Update ${tenant.name}`}
              title="Update tenant"
              disabled={!canUpdate}
              onClick={() => {
                setId(tenant.id);
                onUpdateOpen();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${tenant.name}`}
                  title="Delete tenant"
                  disabled={!canDelete}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete this tenant?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete{' '}
                    <span className="font-semibold">{tenant.name}</span>.
                    Make sure this action is safe for its associated users
                    and devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteMutation.isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteMutation.mutate(tenant.id)}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete tenant'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const tenantRows = tenants?.content ?? [];

  const filteredTenants = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tenantRows.filter((tenant) => {
      const matchesSearch =
        !term ||
        [
          tenant.name,
          tenant.companyName,
          tenant.email,
          tenant.phone,
          tenant.id,
        ].some((value) => String(value ?? '').toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === 'ALL' || tenant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tenantRows, search, statusFilter]);

  const activeOnPage = tenantRows.filter(
    (tenant) => tenant.status === 'ACTIVE',
  ).length;

  const inactiveOnPage = tenantRows.filter(
    (tenant) => tenant.status !== 'ACTIVE',
  ).length;

  const totalTenants = tenants?.totalElements ?? 0;

  const handleExport = () => {
    const headers = [
      'Tenant Name',
      'Company',
      'Email',
      'Phone',
      'Users',
      'Devices',
      'Teams',
      'Status',
    ];

    const csvValue = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const csvRows = filteredTenants.map((tenant) =>
      [
        tenant.name,
        tenant.companyName,
        tenant.email,
        tenant.phone,
        tenant.userNumber,
        tenant.deviceNumber,
        tenant.teamNumber,
        tenant.status,
      ]
        .map(csvValue)
        .join(','),
    );

    const csv = [headers.map(csvValue).join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'tenants.csv';
    link.click();

    URL.revokeObjectURL(url);
    toast.success('Tenant export generated');
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load tenants</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span>Platform management</span>
            <span>/</span>
            <span className="text-foreground">Tenants</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tenants
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage organizations, users, and embedded devices across your
            platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button disabled={!canCreate} onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add tenant
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total tenants</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {totalTenants}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Registered organizations
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Active tenants</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-500">
                {activeOnPage}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                On the current page
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Users</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {tenantRows.reduce(
                  (sum, tenant) => sum + (tenant.userNumber ?? 0),
                  0,
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Across tenants on this page
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Devices</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {tenantRows.reduce(
                  (sum, tenant) => sum + (tenant.deviceNumber ?? 0),
                  0,
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Across tenants on this page
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <Monitor className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, company, email, or ID..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              aria-label="Filter tenants by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </Card> */}
      <section className="rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, company, email, or ID..." aria-label="Search teams"
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter teams by status"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => { }}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* {showFilters && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {filteredTeams.length} teams match your filters.
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )} */}
      </section>
      {/* Tenant inventory */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Tenant inventory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and manage registered organizations.
            </p>
          </div>

          <Badge variant="outline" className="w-fit">
            {totalTenants} total
          </Badge>
        </div>

        {/* Search and filters */}
        {/* <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, company, email, or ID..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              aria-label="Filter tenants by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div> */}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredTenants}
              manualPagination
              pageCount={tenants?.totalPages || 0}
              pagination={{ pageIndex: currentPage, pageSize }}
              onPaginationChange={(updater) => {
                const next =
                  typeof updater === 'function'
                    ? updater({ pageIndex: currentPage, pageSize })
                    : updater;

                setCurrentPage(next.pageIndex);
              }}
              totalElements={tenants?.totalElements || 0}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(0);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantListPage;
