import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";

interface AuthContextType {
    userToken: string | null;
    userCity: string | null;
    userId: string | null;
    userRole: string | null;
    signIn: (token: string) => void;
    setCurrentCity: (city: string) => void;
    signOut: () => void;
}

export const USER_TOKEN_KEY = 'userToken'; // Export the key for AsyncStorage
export const USER_CITY = 'userCity'; // Export the key for AsyncStorage

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userCity, setUserCity] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const loadUserToken = async () => {
            try {
                const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
                const city = await AsyncStorage.getItem(USER_CITY);
                if (token !== null) {
                    setUserToken(token);
                    setUserRole(decodeToken(token).role);
                    setUserId(decodeToken(token).sub);
                }
                if (city) {
                    setUserCity(city);
                }
            } catch (error) {
                console.error('Error loading user token from AsyncStorage:', error);
            }
        };

        loadUserToken();
    }, []);

    const decodeToken = (token: string) => {
        try {
            const decoded = jwt_decode(token);

            if (decoded) {
                return decoded as { role: string };
            }

            return null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const signIn = async (token: string) => {
        try {
            setUserToken(token);
            await AsyncStorage.setItem(USER_TOKEN_KEY, token);
            if (token !== null) {
                setUserRole(decodeToken(token).role);
                setUserId(decodeToken(token).sub)
            }

        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const setCurrentCity = async (city) => {
        try {
            await AsyncStorage.setItem(USER_CITY, city);
            setUserCity(city);
            // Perform actions that depend on the updated city here
        } catch (error) {
            console.error('Error setting city in AsyncStorage:', error);
        }
    };

    useEffect(() => {
        console.log(userCity); // This will log the updated city whenever it changes
        // Perform actions that depend on the updated city here
    }, [userCity]);

    const signOut = async () => {
        try {
            setUserToken(null);
            setUserRole(null); // Clear user role from context after sign out
            setUserId(null); // Clear user role from context after sign out
            setUserCity(null); // Clear user role from context after sign out
            await AsyncStorage.removeItem(USER_TOKEN_KEY);
            await AsyncStorage.removeItem(USER_CITY);
        } catch (error) {
            console.error('Error removing user token from AsyncStorage:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, userRole, userId, userCity, signIn, signOut, setCurrentCity }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
