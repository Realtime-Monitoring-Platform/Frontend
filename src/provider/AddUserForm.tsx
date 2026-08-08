"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import useAddUserModal from "@/hooks/useAddUserModal";
import { getRoleList } from "@/services/roleAction";
import { getTeamList } from "@/services/teamsAction";
import { createUser } from "@/services/usersAction";
import { Tenant } from "@/types";
import { getTenantList } from "@/services/tenantAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

// 1. Interfaces for DB records
interface RoleOption {
  id: string;
  name: string;
}

interface TeamOption {
  id: string;
  name: string;
}

// 2. Form Schema
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  roleId: z.string().min(1, "Role is required"),
  teamId: z.string().min(1, "Team is required"),
  tenantId: z.string().min(1, "Tenant ID is required"), // Assuming tenantId is part of the form, adjust as needed
});

type FormValues = z.infer<typeof formSchema>;

const AddUserForm = () => {
  const { onClose } = useAddUserModal();
  const queryClient = useQueryClient();
  // State for dynamic options fetched from DB
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {user} = useAuth();
  console
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      avatarUrl: "",
      firstName: "",
      lastName: "",
      status: "ACTIVE",
      roleId: "",
      teamId: "",
      tenantId: user?.tenantId || "", // Default to user's tenantId if available
    },
  });


  // Fetch Roles and Teams from DB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [rolesRes, teamsRes, tenantRes] = await Promise.all([
          getRoleList(),
          getTeamList(),
          getTenantList()
        ]);

        setRoles(rolesRes);
        setTeams(teamsRes);
        setTenants(tenantRes);
        console.log("Roles fetched:", rolesRes);
        console.log("Teams fetched:", teamsRes);
        console.log("Tenants fetched", tenantRes);
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error("Could not load roles or teams from database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Submit createUserMutation
  const createUserMutation = useMutation({
    mutationFn: createUser,

    onMutate: () => {
      console.log("Creating user...");
    },

    onSuccess: async (data) => {
      console.log("User created:", data);

      toast.success("User created successfully");

      // Delay to allow the Kafka event to propagate from the user-management
      // service to the query service before refetching the role list.
      // Without this delay the refetch returns stale data because the
      // query service hasn't processed the RoleCreatedEvent yet.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      
      console.log("Users refreshed");

      form.reset();
      onClose();
    },

    onError: (error) => {
      console.error("Create role error:", error);
      toast.error("Failed to create role");
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    createUserMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Username</FormLabel>
              <div className="col-span-3 space-y-1">
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Email</FormLabel>
              <div className="col-span-3 space-y-1">
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Phone</FormLabel>
              <div className="col-span-3 space-y-1">
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">First Name</FormLabel>
              <div className="col-span-3 space-y-1">
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Last Name</FormLabel>
              <div className="col-span-3 space-y-1">
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Avatar URL */}
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Avatar URL</FormLabel>
              <div className="col-span-3 space-y-1">
                <FormControl>
                  <Input placeholder="https://example.com/avatar.png" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Status</FormLabel>
              <div className="col-span-3 space-y-1">
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Dynamic Role Dropdown */}
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Role</FormLabel>
              <div className="col-span-3 space-y-1">
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={isLoading ? "Loading roles..." : "Select a role"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[1000]">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Dynamic Team Dropdown */}
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Team</FormLabel>
              <div className="col-span-3 space-y-1">
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading teams..." : "Select a team"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {user?.tenantId && user.role === "PLATFORM_ADMIN" && (
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                <FormLabel className="text-right">Tenant</FormLabel>
              <div className="col-span-3 space-y-1">
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading tenants..." : "Select a tenant"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={String(tenant.id)}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />)}

        {/* Dialog Actions */}
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createUserMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending
              ? "Creating..."
              : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddUserForm;
