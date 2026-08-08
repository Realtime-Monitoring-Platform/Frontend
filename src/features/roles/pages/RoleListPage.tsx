"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getAllRoles, deleteRole } from "@/services/roleAction";
import type { Role } from "@/types";

import useAddRoleModal from "@/hooks/useAddRoleModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";

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
import useUpdateRoleModal from "@/hooks/useUpdateRoleModal";
import useUpdateUserModal from "@/hooks/useUpdateUserModal";
import { useAuth } from "@/hooks/useAuth";


export const RoleListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onOpen } = useAddRoleModal();
  const { onOpen: onUpdateOpen, setId } = useUpdateRoleModal();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles", currentPage, pageSize],
    queryFn: () => getAllRoles(currentPage, pageSize),
    staleTime: 0,
    refetchOnMount: "always",
  });
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('ROLE_CREATE');
  const canUpdate = hasPermission('ROLE_UPDATE');
  const canDelete = hasPermission('ROLE_DELETE');

  const deleteMutation = useMutation({
    mutationFn: deleteRole,

    onSuccess: async () => {
      toast.success("Role deleted successfully");

      // Delay to allow the Kafka event to propagate from the user-management
      // service to the query service before refetching the role list.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: () => {
      toast.error("Failed to delete role");
    },
  });


  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
    },

    {
      accessorKey: "description",
      header: "Description",
    },

    // {
    //   accessorKey: "userCount",
    //   header: "Users",
    // },

    {
      accessorKey: "isSystemRole",
      header: "System Role",

      cell: ({ getValue }) => {
        const value = getValue() as boolean;

        return (
          <Badge variant={value ? "secondary" : "default"}>
            {value ? "Yes" : "No"}
          </Badge>
        );
      },
    },

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
                onClick={() => {
                  setId(role.id);
                  onUpdateOpen()
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


  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }


  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load roles
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Roles & Permissions
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>


        <Button disabled={!canCreate} onClick={onOpen}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>

      </div>


      <Card>

        <CardContent>

          <DataTable
            columns={columns}
            data={roles?.content || []}
            searchKey="name"
            searchPlaceholder="Search roles..."
            manualPagination
            pageCount={roles?.totalPages || 0}
            pagination={{ pageIndex: currentPage, pageSize }}
            onPaginationChange={(updater) => {
              const next =
                typeof updater === "function"
                  ? updater({ pageIndex: currentPage, pageSize })
                  : updater;
              setCurrentPage(next.pageIndex);
            }}
            totalElements={roles?.totalElements || 0}
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
