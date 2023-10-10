import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedApp from './AuthenticatedApp';
import { View } from 'react-native';
import { Text } from 'react-native';

const AuthWrapper = () => {
    const { userRole } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userRole !== undefined) {
            setLoading(false);
        }
    }, [userRole]);

    if (loading && !userRole) {
        return <LoadingComponent />;
    }

    return <AuthenticatedApp userRole={userRole} />;
};

const LoadingComponent = () => {
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
};

export default AuthWrapper;
