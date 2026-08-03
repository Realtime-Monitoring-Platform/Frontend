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

import { updateTenant } from "@/services/tenantAction";
import type { Tenant } from "@/types";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tenant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

interface UpdateTenantFormProps {
  tenant: Tenant | null;
  onClose: () => void;
}

const UpdateTenantForm = ({ tenant, onClose }: UpdateTenantFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone || "",
      });
    }
  }, [tenant, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateTenant(values.id, values);
      toast.success("Tenant updated successfully");
      onClose();
      form.reset();
    } catch (error) {
      toast.error("Failed to update tenant");
    }
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


        <DialogFooter>
          <Button variant={"outline"} onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateTenantForm;