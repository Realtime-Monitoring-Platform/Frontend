"use client";


import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import useUpdateTeamsModal from "@/hooks/useUpdateTeamsModal";

import { getTeamById, updateTeam } from "@/services/teamsAction";
import { getTenantList } from "@/services/tenantAction";
import { getUsersList } from "@/services/usersAction";

import type { User } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
  tenantId: z.string().min(1, "Tenant is required"),
  leadId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateTeamForm = () => {
  const { id, onClose } = useUpdateTeamsModal();

  const queryClient = useQueryClient();
  const {user} =useAuth();
  const { data: team, isLoading: isTeamLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamById(id!),
    enabled: !!id,
  });

  const { data: tenants = [], isLoading: isTenantsLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenantList,
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersList,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      tenantId: team?.tenantId ?? "",
      leadId: team?.teamLeaderId ?? "",
    },
  });
  

  
  if(team && form ){
    form.setValue("id", team.id);
    form.setValue("name", team.name);
    form.setValue("description", team.description ?? "");
    form.setValue("tenantId", team.tenantId ?? "");
    form.setValue("leadId", team.teamLeaderId ?? "");
  }

  // useEffect(() => {
  //   if (!team) return;

  //   form.reset({
  //     id: team.id,
  //     name: team.name,
  //     description: team.description ?? "",
  //     tenantId: team.tenantId ?? "",
  //     leadId: team.teamLeaderId ?? "",
  //   });
  // }, [team, form]);


  const updateMutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateTeam(values.id, values),

    onSuccess: async () => {
      toast.success("Team updated successfully");

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      await queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["team", id],
      });

      onClose();
    },

    onError: () => {
      toast.error("Failed to update team");
    },
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };

  if (
    isTeamLoading ||
    isTenantsLoading ||
    isUsersLoading
  ) {
    return (
      <div className="flex justify-center p-6">
        <Spinner />
      </div>
    );
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">
                Team Name
              </FormLabel>

              <FormControl>
                <Input
                  className="col-span-3"
                  {...field}
                />
              </FormControl>

              <FormMessage className="col-start-2 col-span-3" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  className="col-span-3"
                  {...field}
                />
              </FormControl>

              <FormMessage className="col-start-2 col-span-3" />
            </FormItem>
          )}
        />

        {
          user && user.role === "PLATFORM_ADMIN" && (

            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="tenantId" className="text-right">
                    Tenant
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map(tenant => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </div>
              )}
            />
          )
        }


        <FormField
          control={form.control}
          name="leadId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">
                Team Lead
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user: User) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage className="col-start-2 col-span-3" />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? "Updating..."
              : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateTeamForm;