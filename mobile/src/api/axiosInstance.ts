import { API_ENDPOINT } from '@env';
import axios from 'axios';
import { USER_TOKEN_KEY } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the interface with skipBearerToken property
interface InternalAxiosRequestConfig<T> {
    // ... other properties ...
    skipBearerToken?: boolean;
    // ... other properties ...
    contentType?: string;
    // ... other properties ...
}

const axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem(USER_TOKEN_KEY);
    return userToken;
};

const setBearerToken = async (config: InternalAxiosRequestConfig<any>): Promise<InternalAxiosRequestConfig<any>> => {
    const userToken = await getUserToken();

    if (userToken) {
        return {
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${userToken}`,
            },
        };
    }

    return config;
};

const setFormDataContentType = async (config: InternalAxiosRequestConfig<any>): Promise<InternalAxiosRequestConfig<any>> => {
    return {
        ...config,
        headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
        },
    };
};

const setJsonContentType = async (config: InternalAxiosRequestConfig<any>): Promise<InternalAxiosRequestConfig<any>> => {
    return {
        ...config,
        headers: {
            ...config.headers,
            'Content-Type': 'application/json',
        },
    };
};

axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig<any>) => {
        // Conditionally apply the interceptor logic
        if (!config.skipBearerToken) {
            config = await setBearerToken(config);
        }
        if (config.contentType) {
            config = await setFormDataContentType(config);
        } else {
            config = await setJsonContentType(config);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
