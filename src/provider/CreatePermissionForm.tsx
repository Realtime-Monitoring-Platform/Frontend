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
import { Textarea } from "@/components/ui/textarea";

import toast from "react-hot-toast";
import { DialogFooter } from "@/components/ui";
import useAddPermissionModal from "@/hooks/useAddPermissionModal";
import { createPermission } from "@/services/permissionAction";

const formSchema = z.object({
  name: z.string().min(1, "Permission name is required"),
  description: z.string().optional(),
  module: z.string().min(1, "Module is required"),
});

const CreatePermissionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      module: "",
    },
  });
  const { onClose } = useAddPermissionModal();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPermission(values);
      toast.success("Permission created successfully");
      onClose();
      form.reset();
    } catch (error) {
      toast.error("Failed to create permission");
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
                Permission Name
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
          name="module"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="module" className="text-right">
                Module
              </FormLabel>
              <FormControl>
                <Input id="module" className="col-span-3" {...field} placeholder="e.g., users, devices, teams" />
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

export default CreatePermissionForm;