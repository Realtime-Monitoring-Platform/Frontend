"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getTenantById, updateTenant } from "@/services/tenantAction";
import type { Tenant } from "@/types";
import { DialogFooter } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUpdateTeanntModal from "@/hooks/useUpdateTeanntModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUsersList } from "@/services/usersAction";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tenant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  status: z.string(),
  adminId: z.string().optional()
});


type FormValues = z.infer<typeof formSchema>;

const UpdateTenantForm = () => {
   const { id, onClose } = useUpdateTeanntModal();
  const queryClient = useQueryClient();
 
  const { data: tenantData, isLoading: isTenantLoading, error: tenantError } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenantById(id || ""),
    enabled: !!id,
  });
  const { data: users, isLoading: isUsersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersList(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
      companyName: "",
      status: "ACTIVE",
      adminId: tenantData?.AdminId,
    },
  });

  

  console.log("id", id);
  console.log("tenantData", tenantData);
  console.log("adminId", tenantData?.AdminId);
  useEffect(() => {
    if (!tenantData) return;
    form.reset({
      name: tenantData.name,
      email: tenantData.email,
      phone: tenantData.phone || "",
      companyName: tenantData.companyName || "",
       status: tenantData.status || "ACTIVE",
      adminId: tenantData.AdminId || "",
    });
  }, [tenantData, form]);




  console.log("id", id);
  console.log("tenantData", tenantData);

  useEffect(() => {
    if (tenantData) {
      form.reset({
        id: tenantData.id,
        name: tenantData.name,
        email: tenantData.email,
        phone: tenantData.phone || "",
        companyName: tenantData.companyName || "",
        status: tenantData.status || "ACTIVE",
        adminId: tenantData.AdminId || "",
      });
    }
  }, [tenantData, form]);

  const updateTenantMutation = useMutation({
    mutationFn: (values: FormValues) => updateTenant(id || "", values),
    onSuccess: async () => {
      toast.success("Tenant updated successfully");

      // Refetch or invalidate relevant query caches
      await queryClient.invalidateQueries({ queryKey: ["tenants"] });
      await queryClient.invalidateQueries({ queryKey: ["tenant", id] });

      onClose();
    },
    onError: (error) => {
      console.error("Update tenant error:", error);
      toast.error("Failed to update tenant");
    },
  });

  const onSubmit = (values: FormValues) => {
    updateTenantMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="name" className="text-right">
                Tenant Name
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
          name="email"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="email" className="text-right">
                Email
              </FormLabel>
              <FormControl>
                <Input id="email" type="email" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="phone" className="text-right">
                Phone
              </FormLabel>
              <FormControl>
                <Input id="phone" className="col-span-3" {...field} />
              </FormControl>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="companyName" className="text-right">
                Company Name
              </FormLabel>
              <FormControl>
                <Input id="companyName" className="col-span-3" {...field} />
              </FormControl>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="status" className="text-right">
                Status
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="adminId"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="adminId" className="text-right">
                Admin ID
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </SelectItem>
                    ))}
                    {/* <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem> */}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
          )}
        />




        <DialogFooter>
          <Button variant={"outline"} onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={updateTenantMutation.isPending}
          >
            {updateTenantMutation.isPending
              ? "Updating..."
              : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateTenantForm;