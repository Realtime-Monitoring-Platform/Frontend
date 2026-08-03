"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

import useAddRoleModal from "@/hooks/useAddRoleModal";
import { createRole } from "@/services/roleAction";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateRoleForm = () => {
  const queryClient = useQueryClient();
  const { onClose } = useAddRoleModal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: createRole,

    onMutate: () => {
      console.log("Creating role...");
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
        queryKey: ["roles"],
      });

      console.log("Roles refreshed");

      form.reset();
      onClose();
    },

    onError: (error) => {
      console.error("Create role error:", error);
      toast.error("Failed to create role");
    },
  });

  const onSubmit = (values: FormValues) => {
    createRoleMutation.mutate(values);
  };

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
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">
                Role Name
              </FormLabel>

              <div className="col-span-3">
                <FormControl>
                  <Input
                    {...field}
                    disabled={createRoleMutation.isPending}
                  />
                </FormControl>

                <FormMessage />
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-start gap-4">
              <FormLabel className="text-right">
                Description
              </FormLabel>

              <div className="col-span-3">
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={createRoleMutation.isPending}
                  />
                </FormControl>

                <FormMessage />
              </div>
            </div>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createRoleMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createRoleMutation.isPending}
          >
            {createRoleMutation.isPending
              ? "Creating..."
              : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateRoleForm;
