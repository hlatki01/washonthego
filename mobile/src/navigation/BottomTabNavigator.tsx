import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use any icon set you prefer
import CustomTabBarComponent from '../components/CustomTabBarComponent';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CompaniesMapScreen from '../screens/CompaniesMapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBarComponent {...props} />}
            initialRouteName="Home"
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    title: t('home'),
                    customIcon: <Icon name="home" size={24} color={'white'} />, // Send custom icon
                }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    headerShown: false,
                    title: t('categories'),
                    customIcon: <Icon name="list" size={24} color={'white'} />
                }}
            />
            <Tab.Screen
                name="Companies"
                component={CompaniesMapScreen}
                options={{
                    headerShown: false,
                    title: t('companies'),
                    customIcon: <Icon name="globe" size={24} color={'white'} />, // Send custom icon
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerShown: false,
                    title: t('settings'),
                    customIcon: <Icon name="cog" size={24} color={'white'} />, // Send custom icon
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    title: t('profile'),
                    customIcon: <Icon name="user" size={24} color={'white'} />, // Send custom icon
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
