import { Pagination, Role } from "@/types";
import { api } from "./api";

export const getAllRoles = async (page = 0, size = 10): Promise<Pagination<Role>> =>{
    try {
        const response = await api.get(`/query/roles?page=${page}&size=${size}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch roles');
    }
}


export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions?: string[]; // IDs for the API request
}
export const createRole = async (data: CreateRoleDto): Promise<Role> => {
  try {
    console.log("Creating role:", data);

    const response = await api.post('/roles', data);

    console.log("Create role response:", response);

    return response.data;

  } catch (error) {
    console.error("Create role error:", error);
    throw error;
  }
};

export const getRoleById = async (id: string): Promise<Role> => {
    try {
        const response = await api.get(`/query/roles/${id}`);
        console.log("getRoleById response:", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch role');
    }   }


    interface UpdateRoleDto {
    name?: string;
    description?: string;
    permissions?: string[]; // IDs for the API request
}
export const updateRole = async (id: string, data: Partial<UpdateRoleDto>): Promise<Role> => {
    try {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

export const deleteRole = async (id: string): Promise<void> => {
    try {
        await api.delete(`/roles/${id}`);
    } catch (error) {
        throw new Error('Failed to delete user');
    }
};


export const getRoleList = async (): Promise<Role[]> => {
    try {
        const response = await api.get('/query/roles/list');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch roles');
    }
};
