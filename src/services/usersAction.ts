import { Pagination, User } from "@/types";
import { api } from "./api";

export const getAllUsers = async (page = 0, size = 10):Promise<Pagination<User>> =>{
    try {
        const response = await api.get(`/query/users?page=${page}&size=${size}`);
        console.log(response.data);

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
}


export const createUser = async (data: Partial<User>): Promise<User> => {
    try {
        const response = await api.post('/users', data);
        console.log(response);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create user');
    }
};


export const getUsersList = async ():Promise<User[]> =>{
    try {
        const {data} = await api.get('/query/users/list');
        console.log(data);
        return data;
    }catch (error) {
        throw new Error('Failed to fetch users');
    }
}



export const getUsersByTenantId =  async (tenantId: string, page = 0, size = 10):Promise<Pagination<User>> =>{
    try {
        ///tenant/{tenantId}
        const {data} = await api.get(`/query/users/tenant/${tenantId}`);
        console.log(data);
        return data;
    }catch (error) {
        throw new Error('Failed to fetch users');
    }
}
export const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await api.get(`/query/users/${id}`);
        console.log("getUserById response:", response.data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user');
    }   }

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
    try {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        throw new Error('Failed to delete user');
    }
};
