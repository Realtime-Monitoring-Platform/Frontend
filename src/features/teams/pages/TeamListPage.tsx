import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Search,
  Shield,
  Filter,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

import type { Team } from '@/types';
import toast from 'react-hot-toast';
import {
  deleteTeam,
  getAllTeams,
  getAllTeamsByTeanntId,
} from '@/services/teamsAction';
import useAddTeamModal from '@/hooks/useAddTeamModal';
import useUpdateTeamsModal from '@/hooks/useUpdateTeamsModal';
import { useAuth } from '@/hooks/useAuth';

const TeamListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onOpen } = useAddTeamModal();
  const { user, hasPermission } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const canCreate = hasPermission('TEAM_CREATE');
  const canUpdate = hasPermission('TEAM_UPDATE');
  const canDelete = hasPermission('TEAM_DELETE');

  const {
    data: teams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teams', currentPage, pageSize],
    queryFn: () => {
      if (user && user.role !== 'PLATFORM_ADMIN') {
        return getAllTeamsByTeanntId(
          user.tenantId || '',
          currentPage,
          pageSize
        );
      }

      return getAllTeams(currentPage, pageSize);
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
  console.log('teams', teams);
  const { onOpen: openUpdateTeamModal, setId } =
    useUpdateTeamsModal();

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: async () => {
      toast.success('Team deleted successfully');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => toast.error('Failed to delete team'),
  });

  const allTeams = teams?.content ?? [];

  // Search and filter the teams on the current page.
  const filteredTeams = allTeams.filter((team: Team) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      [
        team.name,
        team.description,
        team.teamLeaderName,
        team.tenantName,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      );

    // Connect this filter to your real team status field if available.
    const matchesStatus =
      statusFilter === 'all' ||
      String((team as Team & { status?: string }).status ?? '')
        .toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <AlertDescription>Failed to load teams.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="team-management space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Administration</span>
            <span>/</span>
            <span>Teams</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage teams, memberships, and device assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium sm:flex">
            <Shield className="h-4 w-4" />
            {user?.role === 'PLATFORM_ADMIN'
              ? 'Global Administrator'
              : 'Tenant Administrator'}
          </span>

          <Button
            disabled={!canCreate}
            onClick={onOpen}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Team
          </Button>
        </div>
      </div>

      {/* Permission notice */}
      <section className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">
            Role-aware administration
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Team data and available actions depend on your assigned
            role and permissions.
          </p>
        </div>

        <span className="rounded-full border px-3 py-1.5 text-xs font-medium">
          {canCreate || canUpdate || canDelete
            ? 'Permissions enabled'
            : 'Read only'}
        </span>
      </section>

      {/* Search and filters */}
      <section className="rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams, leaders, tenants..."
              aria-label="Search teams"
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
            onClick={() => setShowFilters((value) => !value)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
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
        )}
      </section>

      {/* Team table */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">Team directory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and manage your registered teams.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {teams?.totalElements ?? 0} total teams
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4 font-medium">Team</th>
                {/* <th className="px-5 py-4 font-medium">Description</th> */}
                <th className="px-5 py-4 font-medium">Members</th>
                <th className="px-5 py-4 font-medium">Team administrator</th>
                <th className="px-5 py-4 font-medium">Tenant</th>
                <th className="px-5 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredTeams.map((team: Team) => (
                <tr
                  key={team.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">
                        {team.name}
                      </span>
                    </div>
                  </td>

                  {/* <td className="max-w-[240px] px-5 py-4 text-muted-foreground">
                    <span className="line-clamp-2">
                      {team.description || 'No description'}
                    </span>
                  </td> */}

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      <Users className="h-3.5 w-3.5" />
                      {team.userNumber ?? 0} members
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {team.teamLeaderName || 'Unassigned'}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {team.tenantName || '—'}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`View team ${team.name}`}
                        onClick={() => navigate(`/roles/${team.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Update team ${team.name}`}
                        disabled={!canUpdate}
                        onClick={() => {
                          setId(team.id);
                          openUpdateTeamModal();
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Delete team ${team.name}`}
                            disabled={!canDelete || deleteMutation.isPending}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this team?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete{' '}
                              <span className="font-semibold text-foreground">
                                {team.name}
                              </span>
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
                              onClick={() =>
                                deleteMutation.mutate(team.id)
                              }
                            >
                              {deleteMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete team'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mt-3 font-medium">No teams found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try another search or clear your filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {Math.max(teams?.totalPages ?? 0, 1)}
            {' · '}
            {teams?.totalElements ?? 0} teams
          </p>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              aria-label="Teams per page"
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(0);
              }}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() =>
                setCurrentPage((page) => Math.max(0, page - 1))
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                currentPage + 1 >= (teams?.totalPages ?? 0)
              }
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamListPage;
