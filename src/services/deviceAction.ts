import { Pagination, Device, createDeviceDto } from "@/types";
import { api } from "./api";

export const getAllDevices = async (page = 0, size = 10): Promise<Pagination<Device>> =>{
    try {
        const response = await api.get(`/query/devices?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch devices');
    }
}

export const createDevice = async (data: Partial<createDeviceDto>): Promise<Device> => {
    try {
        const response = await api.post('/devices', data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create device');
    }
};

export const getDeviceById = async (id: string): Promise<Device> => {
    try {
        const response = await api.get(`/query/devices/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch device');
    }   }

export const updateDevice = async (id: string, data: Partial<Device>): Promise<Device> => {
    try {
        const response = await api.put(`/devices/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update device');
    }
};

export const deleteDevice = async (id: string): Promise<void> => {
    try {
        await api.delete(`/devices/${id}`);
    } catch (error) {
        throw new Error('Failed to delete device');
    }
};