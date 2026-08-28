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
import { useAuth } from "@/hooks/useAuth";
import useUpdateProfileModal from "@/hooks/useUpdateProfileModal";



const formSchema = z.object({
    username: z.string().min(1, "Username is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    avatarUrl: z.string().optional(),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateProfileForm = () => {
    const { onClose, id } = useUpdateProfileModal();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const {
        data: userData,
        isLoading: isUserLoading
    } = useQuery({
        queryKey: ["user", user?.userId],
        queryFn: () => getUserById(user?.userId || ""),
        enabled: !!user?.userId,
        refetchOnMount: true,
    });

    // console.log("Fetched user data:", userData);
    // const isOptionsLoading = isUserLoading ;

    // 3. React Hook Form Setup
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: userData?.username,
            email: userData?.email,
            phone: userData?.phone,

            avatarUrl: userData?.avatarUrl,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
        },
    });


    const updateUserMutation = useMutation({
        mutationFn: (values: FormValues) => updateUser(user?.userId || "", values),
        onSuccess: async () => {
            toast.success("User updated successfully");

            await queryClient.invalidateQueries({ queryKey: ["user"] });
            await queryClient.invalidateQueries({ queryKey: ["users", user?.userId] });
            await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
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

    if (!user) {
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
                                    <Input placeholder="johndoe" {...field} defaultValue={user?.username} />
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
                                    <Input type="email" placeholder="john@example.com" {...field} defaultValue={user?.email} />
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
                                    <Input placeholder="+1 234 567 890" {...field} defaultValue={user?.phone} />
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
                                    <Input placeholder="John" {...field} defaultValue={user?.firstName} />
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
                                    <Input placeholder="Doe" {...field} defaultValue={user?.lastName} />
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
                                    <Input placeholder="https://example.com/avatar.png" {...field} defaultValue={user?.avatarUrl} />
                                </FormControl>
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
                        disabled={updateUserMutation.isPending}
                    >
                        {updateUserMutation.isPending ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default UpdateProfileForm;