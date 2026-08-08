"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import useAddTeamModal from "@/hooks/useAddTeamModal";
import { getAllTenants } from "@/services/tenantAction";
import { DialogFooter } from "@/components/ui/dialog";
import { createTeam } from "@/services/teamsAction";
import { getAllUsers, getUsersList } from "@/services/usersAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
  tenantId: z.string().min(1, "Tenant is required"),
  teamLeaderId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddTeamForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tenantId: user?.tenantId || "",
      teamLeaderId: "",
    },
  });
  const { onClose } = useAddTeamModal();
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantsData = await getAllTenants();
        setTenants(tenantsData.content || []);
        const usersData = await getUsersList();
        setUsers(usersData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const createTeamMutation = useMutation({
    mutationFn: createTeam,

    onMutate: () => {
      console.log("Creating team...");
    },

    onSuccess: async (data) => {
      console.log("Role created:", data);

      toast.success("Role created successfully");

      // Delay to allow the Kafka event to propagate from the user-management
      // service to the query service before refetching the role list.
      // Without this delay the refetch returns stale data because the
      // query service hasn't processed the RoleCreatedEvent yet.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      console.log("Teams refreshed");

      form.reset();
      onClose();
    },

    onError: (error) => {
      console.error("Create team error:", error);
      toast.error("Failed to create team");
    },
  });

  const onSubmit = (values: FormValues) => {
    createTeamMutation.mutate(values);
  };
  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     console.log("Submitting form with values:", values);
  //     await createTeam(values);
  //     toast.success("Team created successfully");
  //     onClose();
  //     form.reset();
  //   } catch (error) {
  //     toast.error("Failed to create team");
  //   }
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="name" className="text-right">
                Team Name
              </FormLabel>
              <FormControl>
                <Input id="name" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="description" className="text-right">
                Description
              </FormLabel>
              <FormControl>
                <Textarea id="description" className="col-span-3" {...field} />
              </FormControl>
            </div>
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
          name="teamLeaderId"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="teamLeaderId" className="text-right">
                Team Lead
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createTeamMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createTeamMutation.isPending}
          >
            {createTeamMutation.isPending
              ? "Creating..."
              : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddTeamForm;