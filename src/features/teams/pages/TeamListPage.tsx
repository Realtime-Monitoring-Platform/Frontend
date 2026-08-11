import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Group, Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/data-table';


import type { Team } from '@/types';
import toast from 'react-hot-toast';
import { deleteTeam, getAllTeams, getAllTeamsByTeanntId } from '@/services/teamsAction';
import { getAllTenants, getTenantList } from '@/services/tenantAction';
import useAddTeamModal from '@/hooks/useAddTeamModal';
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
import { getAllUsers, getUsersList } from '@/services/usersAction';
import useUpdateTeamsModal from '@/hooks/useUpdateTeamsModal';
import { useAuth } from '@/hooks/useAuth';
 const TeamListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants-for-team-form'],
    queryFn: getTenantList,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-for-team-form'],
    queryFn: getUsersList,
  });

  const { onOpen } = useAddTeamModal();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: teams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teams", currentPage, pageSize],
    queryFn: () => {

      if (user && user.role !== "PLATFORM_ADMIN") {
        console.log('Fetching teams for tenantId:', user.tenantId);
        return getAllTeamsByTeanntId(user?.tenantId || '', currentPage, pageSize);
      }
     return  getAllTeams(currentPage, pageSize)
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { hasPermission } = useAuth();
  const canCreate = hasPermission('TEAM_CREATE');
  const canUpdate = hasPermission('TEAM_UPDATE');
  const canDelete = hasPermission('TEAM_DELETE');
  const deleteMutation = useMutation({
    mutationFn: deleteTeam,

    onSuccess: async () => {
      toast.success("Team deleted successfully");

      // Delay to allow the Kafka event to propagate from the user-management
      // service to the query service before refetching the role list.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },

    onError: () => {
      toast.error("Failed to delete team");
    },
  });
  const { onOpen: openUpdateTeamModal, setId, id } = useUpdateTeamsModal();
  const columns: ColumnDef<Team>[] = [
    { accessorKey: 'name', header: 'Team Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'userNumber', header: 'Members' },
    // { accessorKey: 'deviceCount', header: 'Devices' },
    { accessorKey: 'teamLeaderName', header: 'Team Lead' },
    { accessorKey: 'tenantName', header: 'Tenant' },
    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => {
        const role = row.original;


        return (
          <div className="flex gap-1">

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(`/roles/${role.id}`)
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
            <>
              <Button
                size="sm"
                variant="ghost"
                 aria-label={`Update team ${role.name}`}
                onClick={() => {
                  setId(role.id);
                  openUpdateTeamModal();
                }}
                disabled={!canUpdate}
              >
                <Pencil className="h-4 w-4" />
              </Button>


              <AlertDialog>

                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                     aria-label={`Delete team ${role.name}`}
                    className="hover:bg-destructive/10"
                    disabled={!canDelete}
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
                        {role.name}
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
                        deleteMutation.mutate(role.id)
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

  if (isLoading) return <div className="flex h-96 w-full items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  if (error) return <Alert variant="destructive"><AlertDescription>Failed to load teams</AlertDescription></Alert>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-sm text-muted-foreground">Manage teams and assignments</p>
        </div>
        <Button  aria-label={`Add team`} disabled={!canCreate} onClick={onOpen}>
          <Plus className="mr-2 h-4 w-4" />Add Team
        </Button>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={teams?.content || []}
            searchKey="name"
            manualPagination
            pageCount={teams?.totalPages || 0}
            pagination={{ pageIndex: currentPage, pageSize }}
            onPaginationChange={(updater) => {
              const next =
                typeof updater === "function"
                  ? updater({ pageIndex: currentPage, pageSize })
                  : updater;
              setCurrentPage(next.pageIndex);
            }}
            totalElements={teams?.totalElements || 0}
            pageSizeOptions={[5, 10, 20, 50]}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* <TeamForm
        open={formOpen}
        onOpenChange={setFormOpen}
        team={selectedTeam}
        tenants={tenants.content || []}
        users={users}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      /> */}

      {/* <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => selectedTeam && deleteMutation.mutate(selectedTeam.id)}
        isConfirming={deleteMutation.isPending}
        entityName={selectedTeam?.name}
      /> */}
    </div>
  );
};

export default TeamListPage;