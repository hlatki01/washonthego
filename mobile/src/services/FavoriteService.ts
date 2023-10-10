import { API_ENDPOINT } from '@env';
import axiosInstance from '../api/axiosInstance';

interface Favorite {
    id: string;
    companyId: string;
    userId: string;
}

interface FavoriteRequest {
    id?: string;
    companyId?: string;
    userId?: string;
}

export const create = async (favoriteData: FavoriteRequest): Promise<Favorite> => {
    try {
        const response = await axiosInstance.post<Favorite>(`${API_ENDPOINT}/favorites/create`, favoriteData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const update = async (favoriteData: FavoriteRequest): Promise<Favorite> => {
    try {
        const response = await axiosInstance.post<Favorite>(`${API_ENDPOINT}/favorites/delete`, favoriteData);
        console.log(response);
        
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getByUser = async (userId: string): Promise<Favorite> => {
    try {
        const response = await axiosInstance.get<Favorite>(`${API_ENDPOINT}/favorites/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}