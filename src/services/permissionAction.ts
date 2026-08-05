import { Pagination, Permission } from "@/types";
import { api } from "./api";

export const getAllPermissions = async (): Promise<Pagination<Permission>> => {
    try {
        const response = await api.get('/query/permissions');
        console.log(response.data);

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch permissions');
    }
}

export const createPermission = async (data: Partial<Permission>): Promise<Permission> => {
    try {
        const response = await api.post('/permissions', data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create permission');
    }
};

export const getPermissionById = async (id: string): Promise<Permission> => {
    try {
        const response = await api.get(`/permissions/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch permission');
    }
}

export const updatePermission = async (id: string, data: Partial<Permission>): Promise<Permission> => {
    try {
        const response = await api.put(`/permissions/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update permission');
    }
};

export const deletePermission = async (id: string): Promise<void> => {
    try {
        await api.delete(`/permissions/${id}`);
    } catch (error) {
        throw new Error('Failed to delete permission');
    }
};
