import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { login, passwordRetrieve, register } from '../services/UserService'; // Assuming you have a register service
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalStyles } from '../styles/styles';
import LoadingComponent from '../components/LoadingComponent';
import { useTranslation } from 'react-i18next';

const PasswordRetrieveScreen = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const handlePasswordRetrieve = async () => {
        try {
            setIsLoading(true);
            const getToken = await passwordRetrieve(email);

            if (getToken.message) {
                Toast.show({
                    type: 'success',
                    text1: `${t('success')}`,
                    text2: `${getToken.message || `${t('anErrorOccurred')}`}`,
                });
                navigation.navigate('PasswordRetrieveSecondStep');
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

    const handleGoBack = () => {
        // Add your logic for handling forgotten passwords here
        navigation.navigate('Login');
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
                        <Image source={require('../../assets/logo-register.png')} style={{ margin: 35 }} width={150} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={setEmail}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={globalStyles.placeholderText.color}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handlePasswordRetrieve}>
                                <Text style={styles.buttonText}>{t('submit')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
                            <Text style={{ color: '#fff' }}>{t('goBack')}</Text>
                        </TouchableOpacity>
                    </>
                )}

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
        flex: 1
    },
    secondaryButton: {
        ...globalStyles.secondaryButton,
    },
    buttonText: {
        ...globalStyles.buttonText,
    },
    registerButton: {
        ...globalStyles.registerButton,
        flex: 1
    },
    registerButtonText: {
        ...globalStyles.registerButtonText,
    },

});

export default PasswordRetrieveScreen;
