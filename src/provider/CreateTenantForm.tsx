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

import useAddTenantModal from "@/hooks/useAddTenantModal";
import { createTenant } from "@/services/tenantAction";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersList } from "@/services/usersAction";

const formSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  adminId: z.string().optional()
});

const CreateTenantForm = () => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      adminId: "",
      status: "ACTIVE"
    },
  });
  const { onClose } = useAddTenantModal();

  const {data:users,isLoading: isUsersLoading, error: usersError} = useQuery({
    queryKey: ['users'],
    queryFn: getUsersList
  })
  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     await createTenant(values);
  //     toast.success("Tenant created successfully");
  //     onClose();
  //     form.reset();
  //   } catch (error) {
  //     toast.error("Failed to create tenant");
  //   }
  // };
const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: async () => {
      toast.success("Tenant created successfully");

      // Delay to allow the Kafka event to propagate from the user-management
      // service to the query service before refetching the tenant list.
      // Without this delay the refetch returns stale data because the
      // query service hasn't processed the TenantCreatedEvent yet.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({ queryKey: ["tenants"] });

      form.reset();
      onClose();
    },
    onError: () => {
      toast.error("Failed to create tenant");
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createMutation.mutate(values);
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
                    {users?.map((user)=>(
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? "Creating..."
              : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTenantForm;