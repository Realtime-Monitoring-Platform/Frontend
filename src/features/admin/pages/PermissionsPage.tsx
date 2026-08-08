import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import type { Permission } from '@/types';


import { getAllPermissions, deletePermission } from '@/services/permissionAction';
import useAddPermissionModal from '@/hooks/useAddPermissionModal';

 const PermissionsPage = () => {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const { data: permissions, isLoading, error } = useQuery({
    queryKey: ['permissions'],
    queryFn: getAllPermissions,
  });

  const { onOpen } = useAddPermissionModal();

  // const createMutation = useMutation({
  //   mutationFn: createPermission,
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); toast.success('Permission created successfully'); },
  //   onError: () => toast.error('Failed to create permission'),
  // });

  // const updateMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<Permission> }) => updatePermission(id, data),
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); toast.success('Permission updated successfully'); },
  //   onError: () => toast.error('Failed to update permission'),
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: deletePermission,
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); toast.success('Permission deleted successfully'); setDeleteOpen(false); },
  //   onError: () => toast.error('Failed to delete permission'),
  // });

  const handleCreate = () => { setSelectedPermission(null); onOpen(); };
  const handleEdit = (permission: Permission) => { setSelectedPermission(permission); };
  const handleDelete = (permission: Permission) => { setSelectedPermission(permission); setDeleteOpen(true); };
  // const handleSubmit = (data: Partial<Permission>) => {
  //   if (selectedPermission) updateMutation.mutate({ id: selectedPermission.id, data });
  //   else createMutation.mutate(data);
  // };

  const columns: ColumnDef<Permission>[] = [
    { accessorKey: 'name', header: 'Permission Name' },
    { accessorKey: 'module', header: 'Module' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'assignedRolesCount',
      header: 'Assigned Roles',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return <Badge variant={value > 0 ? 'default' : 'outline'}>{value}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row.original)}><Shield className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(row.original)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex h-96 w-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  if (error) return <Alert variant="destructive"><AlertDescription>Failed to load permissions</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Permissions</h1>
          <p className="text-sm text-muted-foreground">Manage system permissions</p>
        </div>
        <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" />Add Permission</Button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={permissions?.content || []} searchKey="name" searchPlaceholder="Search permissions..." />
        </CardContent>
      </Card>

      {/* <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => selectedPermission && deleteMutation.mutate(selectedPermission.id)}
        isConfirming={deleteMutation.isPending}
        entityName={selectedPermission?.name}
      /> */}
    </div>
  );
};

export default PermissionsPage;