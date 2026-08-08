import { Notification, Pagination, Team } from "@/types";
import { api } from "./api";




export const getMyNotifications = async (): Promise<Notification[]> =>{
    try {
        const response = await api.get(`/notifications/user/me`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch notifications');
    }
}

export const getUnredNotificationsCount = async (): Promise<number> =>{
    try {
        const response = await api.get(`/notifications/user/me/unreadNumber`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch unread notifications count');
    }
}

export const markAsRead = async (id:string):Promise<void> => {
     try {
        const response = await api.put(`/notifications/${id}/read`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch unread notifications count');
    }
}

export const DeleteNotification = async (id:string):Promise<void> => {
     try {
        const response = await api.delete(`/notifications/${id}`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to delete notification');
    }
}

