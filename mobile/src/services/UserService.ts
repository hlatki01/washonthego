// AuthService.ts

import axiosInstance from '../api/axiosInstance';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  company: string;
  role: string;
  photo: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  photo?: string;
}

interface NewUserRequest {
  name?: string;
  email?: string;
  password?: string;
}



export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(
      '/users/auth',
      { email, password }, { skipBearerToken: true }
    );
    const user = response.data;
    return user;
  } catch (error) {
    throw error;
  }
};

export const register = async (newUserData: NewUserRequest): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(
      '/users/create',
      newUserData, { skipBearerToken: true }
    );
    const user = response.data;
    return user;
  } catch (error) {
    throw error;
  }
};

export const passwordRetrieve = async (email: string): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(
      '/users/reset-token',
      { email: email }, { skipBearerToken: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const passwordChange = async (password: string, token: string): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(
      '/users/reset-password',
      { newPassword: password, resetToken: token }, { skipBearerToken: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(
      '/users/me'
    );
    const user = response.data;
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserData = async (userData: FormData): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(
      '/users/update',
      userData,
      { contentType: 'formData' }
    );
    const user = response.data;
    return user;
  } catch (error) {
    throw error;
  }
};

