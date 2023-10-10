import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import CustomHeaderComponent from '../components/CustomHeaderComponent';
import { useIsFocused } from '@react-navigation/native';

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const AuthenticatedApp = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{
                    title: 'Página Inicial',
                    header: () => <CustomHeaderComponent />,
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthenticatedApp;
