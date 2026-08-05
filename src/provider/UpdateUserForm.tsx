"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
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
import { getRoleList } from "@/services/roleAction";
import { getTeamList } from "@/services/teamsAction";
import { updateUser, getUserById } from "@/services/usersAction"; // Ensure updateUser is imported
import { getTenantList } from "@/services/tenantAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUpdateUserModal from "@/hooks/useUpdateUserModal";
import { Tenant } from "@/types";
import { Spinner } from "@/components/ui/spinner";

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
    status: z.string().min(1, "Status is required"),
    roleId: z.string().min(1, "Role is required"),
    teamId: z.string().min(1, "Team is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateUserForm = () => {
    const { onClose, id } = useUpdateUserModal();
    const queryClient = useQueryClient();

    // 1. Fetch Existing User Data using TanStack Query


    // 2. Fetch Options (Roles, Teams, Tenants) using TanStack Query
    const { data: roles = [], isLoading: isRolesLoading } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoleList,
    });

    const { data: teams = [], isLoading: isTeamsLoading } = useQuery({
        queryKey: ["teams"],
        queryFn: getTeamList,
    });

    const { data: tenants = [], isLoading: isTenantsLoading } = useQuery({
        queryKey: ["tenants"],
        queryFn: getTenantList,
    }); 

    const {
        data: userData,
        isLoading: isUserLoading
    } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id!),
        enabled: !!id,
        refetchOnMount: true,
    });
    console.log("Fetched tenants:", tenants);
    console.log("Fetched roles:", roles);
    console.log("Fetched teams:", teams);
    console.log("Fetched user data:", userData);
    const isOptionsLoading = isUserLoading || isRolesLoading || isTeamsLoading || isTenantsLoading;

    // 3. React Hook Form Setup
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
            roleId: userData?.roleId ? String(userData.roleId) : "",
            teamId: userData?.teamId ? String(userData.teamId) : "",
            tenantId: userData?.tenantId ? String(userData.tenantId) : "",
        },
    });

    // 4. Reset Form Values when userData is fetched
    useEffect(() => {
        if (!userData) return;

        form.reset({
            username: userData.username ?? "",
            email: userData.email ?? "",
            phone: userData.phone ?? "",
            avatarUrl: userData.avatarUrl ?? "",
            firstName: userData.firstName ?? "",
            lastName: userData.lastName ?? "",
            status: userData.status ?? "ACTIVE",
            roleId: String(userData.roleId ?? ""),
            teamId: String(userData.teamId ?? ""),
            tenantId: String(userData.tenantId ?? ""),
        });

    }, [userData, id]);
    // 5. Update User Mutation
    const updateUserMutation = useMutation({
        mutationFn: (values: FormValues) => updateUser(id || "", values),
        onSuccess: async () => {
            toast.success("User updated successfully");

            // Refetch or invalidate relevant query caches
            await queryClient.invalidateQueries({ queryKey: ["users"] });
            await queryClient.invalidateQueries({ queryKey: ["user", id] });

            onClose();
        },
        onError: (error) => {
            console.error("Update user error:", error);
            toast.error("Failed to update user");
        },
    });

    const onSubmit = (values: FormValues) => {
        updateUserMutation.mutate(values);
    };

    if(isUserLoading || isRolesLoading || isTeamsLoading || isTenantsLoading) { 
        return <Spinner className="mx-auto my-8 h-8 w-8 text-primary" />;
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="form-rhf">
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
                                    disabled={isOptionsLoading}

                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={isRolesLoading ? "Loading roles..." : "Select a role"}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-[1000]">
                                        {roles.map((role: RoleOption) => (
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
                                    disabled={isOptionsLoading}

                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue

                                                placeholder={isTeamsLoading ? "Loading teams..." : "Select a team"}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {teams.map((team: TeamOption) => (
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

                {/* Dynamic Tenant Dropdown */}
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
                                    disabled={isOptionsLoading}

                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={isTenantsLoading ? "Loading tenants..." : "Select a tenant"}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {tenants.map((tenant: Tenant) => (
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
                />

                {/* Dialog Actions */}
                <DialogFooter className="pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={updateUserMutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={updateUserMutation.isPending || isUserLoading}
                    >
                        {updateUserMutation.isPending ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default UpdateUserForm;