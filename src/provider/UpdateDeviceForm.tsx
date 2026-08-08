"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import useAddDeviceModal from "@/hooks/useAddDeviceModal";
import { DialogFooter } from "@/components/ui/dialog";
import { getUsersList } from "@/services/usersAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTenantList } from "@/services/tenantAction";
import { getTeamList } from "@/services/teamsAction";
import { createDevice, getDeviceById, updateDevice } from "@/services/deviceAction";
import useUpdateDeviceModal from "@/hooks/useUpdateDeviceModal";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
  tenantId: z.string().min(1, "Tenant is required"),
  teamId: z.string().min(1, "Team is required"),
  assignedUserId: z.string().min(1, "Assigned user is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
 // firmwareVersion: z.string().min(1, "Firmware version is required"),
  hostname: z.string().min(1, "Hostname is required"),
  ipAddress: z.string().min(1, "IP address is required"),
  macAddress: z.string().min(1, "MAC address is required"),
  location: z.string().min(1, "Location is required"),
  status: z.string().min(1, "Status is required"),
});
type FormValues = z.infer<typeof formSchema>;

const UpdateDeviceForm = () => {
  const queryClient = useQueryClient();
  const { onClose, id } = useUpdateDeviceModal();
  console.log("id:::", id);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersList,
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenantList,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeamList,
  });

  const { data: deviceData, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['device', id],
    queryFn: () => getDeviceById(id || ""),
    enabled: !!id,
  });

  const {user} = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceName: "",
      tenantId: deviceData?.tenantId || "",
      teamId: deviceData?.teamId || "",
      assignedUserId: deviceData?.assignedUserId || "",
      manufacturer: "",
      model: "",
      hostname: "",
      ipAddress: "",
      macAddress: "",
      location: "",
      status: "OFFLINE",
    }
  });

  useEffect(() => {
    if (!deviceData) return;
    form.reset({
      deviceName: deviceData.deviceName || "",
      tenantId: deviceData.tenantId || "",
      teamId: deviceData.teamId || "",
      assignedUserId: deviceData.assignedUserId || "",
      manufacturer: deviceData.manufacturer || "",
      model: deviceData.model || "",
   //   firmwareVersion: deviceData.firmwareVersion || "",
      hostname: deviceData.hostname || "",
      ipAddress: deviceData.ipAddress || "",
      macAddress: deviceData.macAddress || "",
      location: deviceData.location || "",
      status: deviceData.status || "OFFLINE",
    });
  }, [deviceData, form]);

  const updateDeviceMutation = useMutation({
    mutationFn: (values: FormValues) => updateDevice(id || "", values),
    onSuccess: async () => {
      toast.success("Device updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["devices"] });
      await queryClient.invalidateQueries({ queryKey: ["device", id] });
      onClose();
    },
    onError: (error) => {
      console.error("Update device error:", error);
      toast.error("Failed to update device");
    },
  });

  const onSubmit = (values: FormValues) => {
    updateDeviceMutation.mutate(values);
    console.log("Update device values:", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {/* Device Name */}
        <FormField
          control={form.control}
          name="deviceName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Device Name</FormLabel>
              <FormControl>
                <Input id="deviceName" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {
          user && user.role === "PLATFORM_ADMIN" && (
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tenant</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants?.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />


          )
        }

        {/* Team */}
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Team</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* Assigned User */}
        <FormField
          control={form.control}
          name="assignedUserId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Assigned User</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* Manufacturer */}
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Manufacturer</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Model</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        

        {/* Hostname */}
        <FormField
          control={form.control}
          name="hostname"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Hostname</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* IP Address */}
        <FormField
          control={form.control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">IP Address</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* MAC Address */}
        <FormField
          control={form.control}
          name="macAddress"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">MAC Address</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Location</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ONLINE">ONLINE</SelectItem>
                  <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                  <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateDeviceMutation.isPending}
          >
            {updateDeviceMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateDeviceForm;