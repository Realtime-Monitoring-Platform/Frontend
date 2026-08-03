import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Building, Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
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
} from "@/components/ui/alert-dialog";
import { getAllTenants, createTenant, updateTenant, deleteTenant } from '@/services/tenantAction';
import useAddTenantModal from '@/hooks/useAddTenantModal';

export const TenantListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
  
    const {
      data: tenants,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["tenants", currentPage, pageSize],
      queryFn: () => getAllTenants(currentPage, pageSize),
      staleTime: 0,
      refetchOnMount: "always",
    });

  const { onOpen } = useAddTenantModal();

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['tenants'] }); 
      toast.success('Tenant created successfully'); 
      setFormOpen(false); 
    },
    onError: () => toast.error('Failed to create tenant'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) => updateTenant(id, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['tenants'] }); 
      toast.success('Tenant updated successfully'); 
      setFormOpen(false); 
    },
    onError: () => toast.error('Failed to update tenant'),
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
  
  const handleEdit = (tenant: Tenant) => { 
    setSelectedTenant(tenant); 
    setFormOpen(true); 
  };

  const columns: ColumnDef<Tenant>[] = [
    { accessorKey: 'name', header: 'Tenant Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'companyName', header: 'Company Name' },
    { accessorKey: 'userNumber', header: 'Users' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge variant={value === 'ACTIVE' ? 'default' : 'outline'}>{value}</Badge>;
      },
    },
    { accessorKey: 'deviceNumber', header: 'Devices' },
    { accessorKey: 'teamNumber', header: 'Teams' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const tenant = row.original;
        return (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/tenants/${tenant.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleEdit(tenant)}>
              <Pencil className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger >
                <Button size="sm" variant="ghost" className="hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete company{' '}
                    <span className="font-semibold text-foreground">{tenant.name}</span> and all associated data.
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
                      deleteMutation.mutate(tenant.id);
                    }}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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

  if (isLoading) return <div className="flex h-96 w-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  if (error) return <Alert variant="destructive"><AlertDescription>Failed to load tenants</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-sm text-muted-foreground">Manage platform tenants</p>
        </div>
        <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" />Add Tenant</Button>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={tenants?.content || []}
            searchKey="name"
            searchPlaceholder="Search tenants..."
            manualPagination
            pageCount={tenants?.totalPages || 0}
            pagination={{ pageIndex: currentPage, pageSize }}
            onPaginationChange={(updater) => {
              const next =
                typeof updater === "function"
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
        </CardContent>
      </Card>
    </div>
  );
};