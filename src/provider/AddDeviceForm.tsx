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

const formSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  type: z.string().min(1, "Device type is required"),
  status: z.string().min(1, "Status is required"),
  ipAddress: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  teamId: z.string().min(1, "Team is required"),
  firmwareVersion: z.string().optional(),
  description: z.string().optional(),
});

const AddDeviceForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      deviceId: "",
      type: "SENSOR",
      status: "OFFLINE",
      ipAddress: "",
      location: "",
      teamId: "",
      firmwareVersion: "v1.0.0",
      description: "",
    },
  });
  const { onClose } = useAddDeviceModal();
  
  const [teams, setTeams] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     try {
  //       const data = await mockTeamApi.list(0, 50);
  //       setTeams(data.content || []);
  //     } catch (error) {
  //       console.error("Failed to fetch teams:", error);
  //     }
  //   };
  //   fetchTeams();
  // }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Device registered successfully");
    onClose();
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
                Device Name
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
          name="deviceId"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="deviceId" className="text-right">
                Device ID
              </FormLabel>
              <FormControl>
                <Input id="deviceId" className="col-span-3" {...field} placeholder="DEV-0001" />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="type" className="text-right">
                Type
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SENSOR">Sensor</SelectItem>
                    <SelectItem value="GATEWAY">Gateway</SelectItem>
                    <SelectItem value="CONTROLLER">Controller</SelectItem>
                    <SelectItem value="SENSOR_ARRAY">Sensor Array</SelectItem>
                    <SelectItem value="ACTUATOR">Actuator</SelectItem>
                    <SelectItem value="CAMERA">Camera</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="ipAddress"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="ipAddress" className="text-right">
                IP Address
              </FormLabel>
              <FormControl>
                <Input id="ipAddress" className="col-span-3" {...field} placeholder="10.0.0.1" />
              </FormControl>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="location" className="text-right">
                Location
              </FormLabel>
              <FormControl>
                <Input id="location" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="teamId" className="text-right">
                Team
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="firmwareVersion"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="firmwareVersion" className="text-right">
                Firmware Version
              </FormLabel>
              <FormControl>
                <Input id="firmwareVersion" className="col-span-3" {...field} />
              </FormControl>
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
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddDeviceForm;