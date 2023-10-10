import { API_ENDPOINT } from '@env';
import axiosInstance from '../api/axiosInstance';

interface Category {
    id: string;
    name: string;
    // Add other category properties as needed
}

interface CreateCategoryRequest {
    name: string;
    // Add other properties required for creating a category
}

interface UpdateCategoryRequest {
    name?: string;
    // Add other properties that can be updated
}

export const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    try {
        const response = await axiosInstance.post<Category>(`${API_ENDPOINT}/categories/create`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategory = async (categoryId: string, categoryData: UpdateCategoryRequest): Promise<Category> => {
    try {
        const response = await axiosInstance.post<Category>(`${API_ENDPOINT}/categories/update`, {
            categoryId,
            ...categoryData,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategory = async (categoryId: string): Promise<Category> => {
    try {
        const response = await axiosInstance.get<Category>(`${API_ENDPOINT}/categories/one?categoryId=${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get<Category[]>(`${API_ENDPOINT}/categories`);
        return response.data;
    } catch (error) {       
        throw error;
    }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
    try {
        await axiosInstance.post(`${API_ENDPOINT}/categories/delete`, { categoryId });
    } catch (error) {
        throw error;
    }
};
