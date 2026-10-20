
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  LayoutGrid,
  List as ListIcon,
  Search,
  Mail,
  Building2,
  Shield,
  Filter,
  MoreHorizontal,
  Users,
  UserRound,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
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

import type { User } from '@/types';
import {
  getAllUsers,
  deleteUser,
  getUsersByTenantId,
} from '@/services/usersAction';

import useAddUserModal from '@/hooks/useAddUserModal';
import useUpdateUserModal from '@/hooks/useUpdateUserModal';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'grid' | 'list';

const UserListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { onOpen } = useAddUserModal();

  const {
    onOpen: onUpdateOpen,
    setId: setUpdateId,
  } = useUpdateUserModal();

  const { user, hasPermission } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const canUpdate = hasPermission('USER_UPDATE');
  const canDelete = hasPermission('USER_DELETE');
  const canCreate = hasPermission('USER_CREATE');

  const isPlatformAdmin = user?.role === 'PLATFORM_ADMIN';

  const {
    data: users,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      'users',
      user?.role,
      user?.tenantId,
      currentPage,
      pageSize,
    ],
    queryFn: () => {
      if (user && !isPlatformAdmin) {
        return getUsersByTenantId(
          user.tenantId || '',
          currentPage,
          pageSize,
        );
      }

      return getAllUsers(currentPage, pageSize);
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,

    onSuccess: async () => {
      toast.success('User deleted successfully');

      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },

    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const usersList: User[] = users?.content ?? [];

  // The API currently returns one page at a time, so search and
  // status filtering apply to the currently loaded page.
  const filteredUsers = usersList.filter((target) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      `${target.firstName ?? ''} ${target.lastName ?? ''}`
        .toLowerCase()
        .includes(query) ||
      target.email?.toLowerCase().includes(query) ||
      target.username?.toLowerCase().includes(query) ||
      target.tenantName?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'ALL' ||
      target.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const initials = (target: User) =>
    `${target.firstName?.[0] ?? ''}${target.lastName?.[0] ?? ''}`
      .toUpperCase() || 'U';

  const fullName = (target: User) =>
    `${target.firstName ?? ''} ${target.lastName ?? ''}`.trim() ||
    target.username ||
    'Unknown user';

  const getStatusStyle = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600';

      case 'INVITED':
        return 'border-amber-500/20 bg-amber-500/10 text-amber-600';

      case 'PENDING':
        return 'border-amber-500/20 bg-amber-500/10 text-amber-600';

      case 'INACTIVE':
        return 'border-slate-500/20 bg-slate-500/10 text-slate-500';

      case 'SUSPENDED':
        return 'border-red-500/20 bg-red-500/10 text-red-600';

      default:
        return 'border-border bg-muted text-muted-foreground';
    }
  };

  const renderUserActions = (target: User) => {
    const name = fullName(target);

    return (
      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(`/users/${target.id}`)}
          aria-label={`View ${name}`}
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </Button>

        {canUpdate && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setUpdateId(target.id);
              onUpdateOpen();
            }}
            aria-label={`Edit ${name}`}
            title="Edit user"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${name}`}
                title="Delete user"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete user account?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. The account for{' '}
                  <span className="font-semibold text-foreground">
                    {name}
                  </span>{' '}
                  will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteMutation.isPending}
                  onClick={(event) => {
                    event.preventDefault();
                    deleteMutation.mutate(target.id);
                  }}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete user'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'user',
      accessorKey: 'firstName',
      header: 'User',
      cell: ({ row }) => {
        const target = row.original;

        return (
          <button
            type="button"
            onClick={() => navigate(`/users/${target.id}`)}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <Avatar className="h-10 w-10 shrink-0 border border-border">
              {target.avatarUrl && (
                <AvatarImage
                  src={target.avatarUrl}
                  alt={fullName(target)}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials(target)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="max-w-48 truncate font-medium text-foreground">
                {fullName(target)}
              </p>
              <p className="max-w-48 truncate text-xs text-muted-foreground">
                @{target.username || 'unknown'}
              </p>
            </div>
          </button>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="max-w-56 truncate text-sm">
            {row.original.email || '—'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        // Adapt this to your actual User type if roles are stored
        // in a separate relationship or returned by another endpoint.
        const target = row.original as User & {
          role?: string | { name?: string };
          roleName?: string;
        };

        const roleName =
          target.roleName ||
          (typeof target.role === 'string'
            ? target.role
            : target.role?.name) ||
          'Not assigned';

        return (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            {roleName.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      accessorKey: 'tenantName',
      header: 'Tenant / Organization',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="max-w-48 truncate text-sm">
            {row.original.tenantName || '—'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || 'UNKNOWN';

        return (
          <Badge
            variant="outline"
            className={`gap-1.5 whitespace-nowrap font-medium ${getStatusStyle(status)}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-right">Actions</div>
      ),
      cell: ({ row }) => renderUserActions(row.original),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>Failed to load users. Please try again.</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const activeCount = usersList.filter(
    (target) => target.status?.toUpperCase() === 'ACTIVE',
  ).length;

  const invitedCount = usersList.filter(
    (target) => target.status?.toUpperCase() === 'INVITED',
  ).length;

  return (
    <div className="min-w-0 space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Users
            </h1>
          </div>

          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage user accounts, access permissions, and organization
            membership.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="h-8 gap-1.5 rounded-md px-3"
          >
            <Shield className="h-3.5 w-3.5" />
            {isPlatformAdmin
              ? 'Global Administrator'
              : 'Tenant Administrator'}
          </Badge>

          <Button
            variant="outline"
            className="h-9"
            onClick={() => {
              const headers = [
                'First Name',
                'Last Name',
                'Username',
                'Email',
                'Tenant',
                'Status',
              ];

              const csvRows = [
                headers,
                ...filteredUsers.map((target) => [
                  target.firstName ?? '',
                  target.lastName ?? '',
                  target.username ?? '',
                  target.email ?? '',
                  target.tenantName ?? '',
                  target.status ?? '',
                ]),
              ];

              const csv = csvRows
                .map((row) =>
                  row
                    .map((value) =>
                      `"${String(value).replace(/"/g, '""')}"`,
                    )
                    .join(','),
                )
                .join('\n');

              const blob = new Blob(
                ['\uFEFF' + csv],
                { type: 'text/csv;charset=utf-8;' },
              );

              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');

              link.href = url;
              link.download = 'users.csv';
              link.click();

              URL.revokeObjectURL(url);
              toast.success('Users exported successfully');
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            className="h-9"
            disabled={!canCreate}
            onClick={onOpen}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      {/* Role-aware permission notice */}
      <section className="rounded-xl border border-primary/15 bg-primary/[0.035] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-background">
              <Shield className="h-4 w-4 text-primary" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold">
                Role-aware administration
              </p>

              <p className="max-w-3xl text-sm leading-5 text-muted-foreground">
                {isPlatformAdmin
                  ? 'You have global administration access. Manage accounts across authorized organizations.'
                  : 'User data is scoped to your organization. Available operations depend on your assigned permissions.'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            <Badge variant="outline" className="bg-background">
              {canCreate ? 'Create enabled' : 'Read only'}
            </Badge>
            <Badge variant="outline" className="bg-background">
              {canUpdate ? 'Edit enabled' : 'Edit restricted'}
            </Badge>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="rounded-xl shadow-none">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Users on this page
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                {usersList.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-none">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Active on this page
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                {activeCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserRound className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-none">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Invited on this page
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                {invitedCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Mail className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <section className="rounded-xl border bg-card p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users by name, email, username, or tenant..."
              className="h-10 border-border bg-background pl-9"
              aria-label="Search users"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 min-w-36 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter users by status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INVITED">Invited</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset filters
            </Button>

            <div
              className="flex h-10 items-center gap-1 rounded-md border bg-background p-1"
              role="group"
              aria-label="Display mode"
            >
              <Button
                type="button"
                size="icon"
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <ListIcon className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-xs text-muted-foreground">
            Showing {filteredUsers.length} of {users?.totalElements ?? usersList.length} users
          </p>

          {isFetching && (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Refreshing data...
            </span>
          )}
        </div>
      </section>

      {/* Users table */}
      {viewMode === 'list' ? (
        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-1 border-b px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold">
              User directory
            </h2>
            <p className="text-sm text-muted-foreground">
              Account identities, organization membership, and access status.
            </p>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="font-medium">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>

              {(search || statusFilter !== 'ALL') && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredUsers}
                searchKey="username"
                manualPagination
                pageCount={users?.totalPages || 0}
                pagination={{
                  pageIndex: currentPage,
                  pageSize,
                }}
                onPaginationChange={(updater) => {
                  const next =
                    typeof updater === 'function'
                      ? updater({
                          pageIndex: currentPage,
                          pageSize,
                        })
                      : updater;

                  setCurrentPage(next.pageIndex);
                  setPageSize(next.pageSize);
                }}
                totalElements={users?.totalElements || 0}
                pageSizeOptions={[5, 10, 20, 50]}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(0);
                }}
              />
            </div>
          )}
        </section>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <Card className="rounded-xl shadow-none">
              <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
                <Users className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-medium">No users found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredUsers.map((target) => {
                const name = fullName(target);

                return (
                  <Card
                    key={target.id}
                    className="overflow-hidden rounded-xl shadow-none transition-colors hover:border-primary/30"
                  >
                    <CardContent className="flex h-full flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-11 w-11 shrink-0 border">
                            {target.avatarUrl && (
                              <AvatarImage
                                src={target.avatarUrl}
                                alt={name}
                              />
                            )}
                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                              {initials(target)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <button
                              type="button"
                              className="block max-w-full truncate text-left font-semibold hover:text-primary"
                              onClick={() => navigate(`/users/${target.id}`)}
                            >
                              {name}
                            </button>

                            <p className="truncate text-sm text-muted-foreground">
                              @{target.username || 'unknown'}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={getStatusStyle(target.status)}
                        >
                          {target.status || 'Unknown'}
                        </Badge>
                      </div>

                      <div className="my-4 space-y-3">
                        <div className="flex min-w-0 items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-muted-foreground">
                            {target.email || 'No email provided'}
                          </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-muted-foreground">
                            {target.tenantName || 'No organization'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {(() => {
                              const roleUser = target as User & {
                                role?: string | { name?: string };
                                roleName?: string;
                              };

                              return (
                                roleUser.roleName ||
                                (typeof roleUser.role === 'string'
                                  ? roleUser.role
                                  : roleUser.role?.name) ||
                                'Not assigned'
                              );
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t pt-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/users/${target.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View profile
                        </Button>

                        {renderUserActions(target)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Grid view pagination */}
      {viewMode === 'grid' && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {(users?.number ?? currentPage) + 1} of {Math.max(users?.totalPages ?? 1, 1)}
            {' · '}
            {users?.totalElements ?? 0} total users
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 0 || isFetching}
              onClick={() =>
                setCurrentPage((page) => Math.max(0, page - 1))
              }
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                currentPage + 1 >= (users?.totalPages ?? 1) ||
                isFetching
              }
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
