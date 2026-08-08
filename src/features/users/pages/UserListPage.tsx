import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Download, Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
      cell: ({ row }) => {
        const user = row.original;
        const fullName = `${user.firstName} ${user.lastName}`;

        return (
          <div className="flex gap-1">
            {/* View Details Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/users/${user.id}`)}
              aria-label={`View details for ${fullName}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>

            {/* Edit Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setUpdateId(row.original.id);
                onUpdateOpen();
              }}
              disabled={!canUpdate}
              aria-label={`Edit user ${fullName}`}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>

            {/* Delete Trigger Button - fixed nested button markup with asChild */}
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
                    <span className="font-semibold text-foreground">
                      {fullName}
                    </span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteMutation.isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteMutation.isPending}
                    onClick={(e) => {
                      e.preventDefault(); 
                      deleteMutation.mutate(user.id);
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
      },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts</p>
        </div>
        <div className="flex gap-2">
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

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={users?.content || []}
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
            pageSizeOptions={[5, 10, 20, 50]}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserListPage;
