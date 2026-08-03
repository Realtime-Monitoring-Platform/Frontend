import { Pagination, Role, Tenant } from "@/types";
import { api } from "./api";

export const getAllTenantsd = async ():Promise<Pagination<Tenant>> =>{
    try {
        const response = await api.get('/query/tenants');
        console.log(response.data);

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch tenants');
    }
}

export const getAllTenants = async (page = 0, size = 10): Promise<Pagination<Tenant>> =>{
    try {
        const response = await api.get(`/query/tenants?page=${page}&size=${size}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch roles');
    }
}


interface CreateTenantDto {
    name: string;
    email: string;
    phone?: string;
    companyName?: string;
    status?: string;
    adminId?:string;
}

// interface CreateTenantResponse {
//     id: string;
//     name: string;
//     email: string;
//     phone?: string;
//     companyName?: string;
//     status: 'ACTIVE' | 'INACTIVE';
//     adminId?: string;

// }
export const createTenant = async (data: CreateTenantDto): Promise<Tenant> => {
    try {
        const response = await api.post('/tenants', data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create user');
    }
};

export const getTenantById = async (id: string): Promise<Tenant> => {
    try {
        const response = await api.get(`/query/tenants/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user');
    }   }



export const updateTenant = async (id: string, data: CreateTenantDto): Promise<Tenant> => {
    try {
        const response = await api.put(`/tenants/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

export const deleteTenant = async (id: string): Promise<void> => {
    try {
        await api.delete(`/tenants/${id}`);
    } catch (error) {
        throw new Error('Failed to delete user');
    }
};

export const getTenantList = async (): Promise<Tenant[]> => {
    try {
        const response = await api.get('/query/tenants/list');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch tenants');
    }
};
