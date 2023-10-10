import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import AuthWrapper from './AuthWrapper';
import RegisterScreen from '../screens/RegisterScreen';
import PasswordRetrieveScreen from '../screens/PasswordRetrieveScreen';
import PasswordRetrieveSecondStepScreen from '../screens/PasswordRetrieveSecondStepScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userToken } = useAuth();

  const screenOptions = {
    headerShown: false,
    cardStyle: { backgroundColor: 'white' }, // Set the background color of the screens to white
  };

  return (
    <NavigationContainer theme={{ colors: { background: 'white', primary: '#0C5298' } }}>
      <Stack.Navigator screenOptions={screenOptions}>
        {userToken ? (
          <Stack.Group>
            <Stack.Screen name="Auth" component={AuthWrapper} />
          </Stack.Group>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="PasswordRetrieve" component={PasswordRetrieveScreen} />
            <Stack.Screen name="PasswordRetrieveSecondStep" component={PasswordRetrieveSecondStepScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
