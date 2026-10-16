import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Download, Plus, Pencil, Trash2, Eye, Loader2, LayoutGrid, List as ListIcon, Search, Mail, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import type { User } from '@/types';
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
} from "@/components/ui/alert-dialog";
import { getAllUsers, deleteUser, getUsersByTenantId } from '@/services/usersAction';
import useAddUserModal from '@/hooks/useAddUserModal';
import { useState } from 'react';
import useUpdateUserModal from '@/hooks/useUpdateUserModal';
import { useAuth } from '@/hooks/useAuth';


const UserListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onOpen } = useAddUserModal();
  const {
    onOpen: onUpdateOpen,
    setId: setUpdateId,
  } = useUpdateUserModal();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridSearch, setGridSearch] = useState('');
  const {user,hasPermission} = useAuth();
  const canUpdate= hasPermission('USER_UPDATE');
  const canDelete= hasPermission('USER_DELETE');
  const canCreate= hasPermission('USER_CREATE');


  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, pageSize],
    queryFn: () =>{ 
      if(user && user.role !== "PLATFORM_ADMIN"){
        console.log('Fetching users for tenantId:', user.tenantId);
        return getUsersByTenantId(user?.tenantId || '',currentPage, pageSize);
      }

      return getAllUsers(currentPage, pageSize)

    },
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!user
  });


  const deleteMutation = useMutation({
    mutationFn: deleteUser,

    onSuccess: async () => {
      toast.success("User deleted successfully");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: () => {
      toast.error("Failed to delete role");
    },
  });

  console.log('Current user:', user?.role);

  // Shared action buttons (view / edit / delete) reused by BOTH the table and the grid.
  const renderUserActions = (target: User) => {
    const fullName = `${target.firstName} ${target.lastName}`;
    return (
      <div className="flex gap-1">
        {/* View Details */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/users/${target.id}`)}
          aria-label={`View details for ${fullName}`}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Edit */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setUpdateId(target.id);
            onUpdateOpen();
          }}
          disabled={!canUpdate}
          aria-label={`Edit user ${fullName}`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={!canDelete}
              size="sm"
              variant="ghost"
              className="hover:bg-destructive/10"
              aria-label={`Delete user ${fullName}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete user{' '}
                <span className="font-semibold text-foreground">{fullName}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  deleteMutation.mutate(target.id);
                }}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  const initials = (u: User) =>
    `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'tenantName', header: 'Tenant' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge >{value}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => renderUserActions(row.original),
    },
  ];

  if (isLoading)
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load users</AlertDescription>
      </Alert>
    );

  const usersList = users?.content || [];

  // Grid view filters client-side within the current page (table has its own search).
  const filteredUsers = viewMode === 'grid'
    ? usersList.filter((u) => {
        const q = gridSearch.trim().toLowerCase();
        if (!q) return true;
        return (
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.tenantName?.toLowerCase().includes(q)
        );
      })
    : usersList;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts</p>
        </div>
        <div className="flex gap-2">
          {/* View mode toggle */}
          <div
            className="flex items-center gap-1 rounded-md border bg-background p-1"
            role="group"
            aria-label="View mode"
          >
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              className="h-8 w-8 p-0"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              className="h-8 w-8 p-0"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Export
          </Button>
          <Button disabled={!canCreate} onClick={onOpen}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add User
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="space-y-4">
          {/* Grid search */}
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={gridSearch}
              onChange={(e) => setGridSearch(e.target.value)}
              placeholder="Search this page by name, email, user..."
              className="pl-9"
              aria-label="Search users"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                No users found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUsers.map((u) => (
                <Card key={u.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="lg">
                          {u.avatarUrl ? (
                            <AvatarImage src={u.avatarUrl} alt={`${u.firstName} ${u.lastName}`} />
                          ) : null}
                          <AvatarFallback>{initials(u)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium leading-tight">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">@{u.username}</p>
                        </div>
                      </div>
                      <Badge>{u.status}</Badge>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{u.tenantName || '—'}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-end border-t pt-3">
                      {renderUserActions(u)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination footer (page-level controls mirroring the table) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Page {(users?.number ?? 0) + 1} of {users?.totalPages ?? 1} · {users?.totalElements ?? 0} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage + 1 >= (users?.totalPages ?? 1)}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={usersList}
            searchKey="username"
            manualPagination
            pageCount={users?.totalPages || 0}
            pagination={{ pageIndex: currentPage, pageSize }}
            onPaginationChange={(updater) => {
              const next =
                typeof updater === "function"
                  ? updater({ pageIndex: currentPage, pageSize })
                  : updater;
              setCurrentPage(next.pageIndex);
            }}
            totalElements={users?.totalElements || 0}
            pageSizeOptions={[1,2,5, 10, 20, 50]}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default UserListPage;
