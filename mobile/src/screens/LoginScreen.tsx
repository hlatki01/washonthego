import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/UserService';
import LoadingComponent from '../components/LoadingComponent';
import { globalStyles } from '../styles/styles';
import { useTranslation } from 'react-i18next';
import CitySelectionModal from '../components/CitySelectionModal';

import * as AuthSession from 'expo-auth-session';


const LoginScreen = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showCityModal, setShowCityModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');

    const { signIn, setCurrentCity, userCity } = useAuth();
    const navigation = useNavigation();

    const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true, // only if you're using Expo Go
      });

    const handleLogin = async () => {
        try {
            setIsLoading(true);

            if (!userCity) {
                setShowCityModal(true)
            }
            else {
                const user = await login(email, password);
                if (user) {
                    signIn(user.token);
                    navigation.navigate('Home');
                }
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: `${t('error')}`,
                text2: `${error.response?.data?.error || `${t('anErrorOccurred')}`}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCitySave = async (city) => {
        setShowCityModal(true);
        setSelectedCity(city);
        try {
            await setCurrentCity(city);
            const user = await login(email, password);
            if (user) {
                signIn(user.token);
                navigation.navigate('Home');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: `${t('error')}`,
                text2: `${error.response?.data?.error || `${t('anErrorOccurred')}`}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('PasswordRetrieve');
    };

    const handleSignUp = () => {
        // Navigate to the sign-up screen
        navigation.navigate('Register');
    };

    const handleFacebookLogin = async () => {
        const authResponse = await AuthSession.startAsync({
          authUrl:
            `https://www.facebook.com/v12.0/dialog/oauth?response_type=token` +
            `&client_id=1051692109195816` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}`,
        });
    
        if (authResponse.type === 'success') {
          // Handle the successful login here
          console.log(authResponse.params.access_token);
        } else {
          // Handle errors or cancellations
          console.log('Facebook login failed');
        }
      };
    

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // You might need to adjust this offset based on your layout
        >
            <View style={styles.container}>
                {isLoading ? (
                    <LoadingComponent color={'#fff'} />
                ) : (
                    <>
                        <Image source={require('../../assets/logo.png')} style={styles.logo} width={150} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email')}
                            onChangeText={setEmail}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={globalStyles.placeholderText.color}
                        />
                        <View style={styles.passwordInput}>
                            <TextInput
                                style={styles.passwordTextInput}
                                placeholder={t('password')}
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry={!passwordVisible}
                                placeholderTextColor={globalStyles.placeholderText.color}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                                {passwordVisible ? (
                                    <Icon name="eye-slash" size={18} style={styles.eyeIcon} />
                                ) : (
                                    <Icon name="eye" size={18} style={styles.eyeIcon} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleLogin}>
                                <Text style={styles.buttonText}>{t('login')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleSignUp}>
                                <Text style={styles.registerButtonText}>{t('register')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
                                <Icon name="facebook" size={20} color="#00293f" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
                                <Icon name="google" size={20} color="#00293f" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleForgotPassword}>
                            <Text style={{ color: '#fff' }}>{t('forgotPassword')}</Text>
                        </TouchableOpacity>
                    </>
                )}
                <CitySelectionModal
                    visible={showCityModal}
                    onClose={() => setShowCityModal(false)}
                    onSave={handleCitySave}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    logo: {
        ...globalStyles.logo,
    },
    input: {
        ...globalStyles.input,
    },
    passwordInput: {
        ...globalStyles.passwordInput,
    },
    passwordTextInput: {
        ...globalStyles.passwordTextInput,
    },
    eyeIcon: {
        ...globalStyles.eyeIcon,
    },
    buttonContainer: {
        ...globalStyles.buttonContainer,
    },
    button: {
        ...globalStyles.button,
    },
    primaryButton: {
        ...globalStyles.primaryButton,
        flex: 1,
    },
    secondaryButton: {
        ...globalStyles.secondaryButton,
    },
    buttonText: {
        ...globalStyles.buttonText,
    },
    registerButton: {
        ...globalStyles.registerButton,
        flex: 1,
    },
    registerButtonText: {
        ...globalStyles.registerButtonText,
    },
    facebookButton: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 7,
        paddingHorizontal: 11,
        borderRadius: 10
    },
    googleButton: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 7,
        paddingHorizontal: 7,
        borderRadius: 10
    },
    divider: {
        height: 1,
        backgroundColor: '#fff', // Set the color of the divider line
        marginVertical: 10, // Adjust the vertical spacing above and below the divider
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 25,
    }
});

export default LoginScreen;
