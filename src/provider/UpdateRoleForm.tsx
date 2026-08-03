"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


import useAddRoleModal from "@/hooks/useAddRoleModal";
import { getAllPermissions } from "@/services/permissionAction";
import { createRole, getRoleById, updateRole } from "@/services/roleAction";
import { DialogFooter } from "@/components/ui/dialog";
import useUpdateRoleModal from "@/hooks/useUpdateRoleModal";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;


const UpdateRoleForm = () => {
  const { onClose, id } = useUpdateRoleModal();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });


  const { data: roleData, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['role', id],
    queryFn: () => getRoleById(id || ""),
    enabled: !!id,
  });
  console.log("id", id);
  console.log("roleData", roleData);
  useEffect(() => {
    if (!roleData) return;
    form.reset({
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions ? roleData.permissions.map((p) => p.id) : [],
    });
  }, [roleData, id]);

  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await getAllPermissions();
        setPermissions(data.content || data || []);
      } catch (err) {
        toast.error("Unable to load permissions");
      }
    };

    loadPermissions();
  }, []);

 
 

  const updateRoleMutation = useMutation({
        mutationFn: (values: FormValues) => updateRole(id || "", {description: values.description, name: values.name, permissions: values.permissions}),
        onSuccess: async () => {
            toast.success("Role updated successfully");

            // Refetch or invalidate relevant query caches
            await queryClient.invalidateQueries({ queryKey: ["roles"] });
            await queryClient.invalidateQueries({ queryKey: ["role", id] });

            onClose();
        },
        onError: (error) => {
            console.error("Update role error:", error);
            toast.error("Failed to update role");
        },
    });

    const onSubmit = (values: FormValues) => {
        updateRoleMutation.mutate(values);
    };

  const selectedPermissions = form.watch("permissions") || [];

  const togglePermission = (id: string) => {
    const current = new Set(selectedPermissions);
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    form.setValue("permissions", Array.from(current), { shouldValidate: true });
  };

  const modules = [...new Set(permissions.map((p) => p.module))];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-4 items-center">
              <FormLabel>Rolesss Name</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-start-2 col-span-3" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-4 items-center">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="col-span-3" {...field} />
              </FormControl>
            </div>
          )}
        />

        <div className="grid grid-cols-4 gap-4">
          <FormLabel className="pt-2">Permissions</FormLabel>
          <div className="col-span-3 border rounded-md p-4 max-h-80 overflow-auto">
            {modules.map((module) => (
              <div key={module} className="mb-5">
                <h4 className="font-semibold mb-2">{module}</h4>

                {permissions
                  .filter((p) => p.module === module)
                  .map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center gap-2 py-1"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      /> 
                      <label
                        className="flex-1 cursor-pointer text-sm font-medium"
                        onClick={() => togglePermission(permission.id)}
                      >
                        {permission.name}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {permission.description}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateRoleMutation.isPending}>
            {updateRoleMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateRoleForm;
