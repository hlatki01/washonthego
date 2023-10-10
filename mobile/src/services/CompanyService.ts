import { API_ENDPOINT } from '@env';
import axiosInstance from '../api/axiosInstance';

interface Company {
    id: string;
    name: string;
    // Add other category properties as needed
}

export const listCompanies = async (): Promise<Company> => {
    try {
        const response = await axiosInstance.get<Company>(`${API_ENDPOINT}/companies`);
        return response.data;
    } catch (error) {
        throw error;
    }
}