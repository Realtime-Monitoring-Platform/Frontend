import { Pagination, Team } from "@/types";
import { api } from "./api";




export const getAllTeams = async (page = 0, size = 10): Promise<Pagination<Team>> =>{
    try {
        const response = await api.get(`/query/teams?page=${page}&size=${size}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch roles');
    }
}

export const createTeam = async (data: Partial<Team>): Promise<Team> => {
    try {
        console.log("Creating team:////////////", data);
        const response = await api.post('/teams', data);
        console.log("Created team::::::::::::::::::", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create team');
    }
};

export const getTeamById = async (id: string): Promise<Team> => {
    try {
        const response = await api.get(`/query/teams/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch team');
    }   }

export const updateTeam = async (id: string, data: Partial<Team>): Promise<Team> => {
    try {
        const response = await api.put(`/teams/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update team');
    }
};

export const deleteTeam = async (id: string): Promise<void> => {
    try {
        await api.delete(`/teams/${id}`);
    } catch (error) {
        throw new Error('Failed to delete team');
    }
};


export const getTeamList = async (): Promise<Team[]> => {
    try {
        const response = await api.get('/query/teams/list');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch teams');
    }
};
