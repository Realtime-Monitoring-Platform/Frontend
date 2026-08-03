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

import toast from "react-hot-toast";
import { DialogFooter } from "@/components/ui";
import useAddTenantModal from "@/hooks/useAddTenantModal";
import { createTenant } from "@/services/tenantAction";

const formSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
});

const CreateTenantForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
    },
  });
  const { onClose } = useAddTenantModal();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createTenant(values);
      toast.success("Tenant created successfully");
      onClose();
      form.reset();
    } catch (error) {
      toast.error("Failed to create tenant");
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

        <DialogFooter>
          <Button variant={"outline"} onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTenantForm;