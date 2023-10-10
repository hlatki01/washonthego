import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { passwordChange } from '../services/UserService'; // Assuming you have a register service
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalStyles } from '../styles/styles';
import LoadingComponent from '../components/LoadingComponent';
import { useTranslation } from 'react-i18next';

const PasswordRetrieveSecondStepScreen = () => {
    const { t } = useTranslation();

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const handlePasswordRetrieve = async () => {
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: `${t('error')}`,
                text2: `${t('passwordNotMatch')}`,
            });
            return;
        }

        try {
            setIsLoading(true);
            const passwordRetrieve = await passwordChange(password, token)
            if (passwordRetrieve.message) {
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: `${passwordRetrieve.message || `${t('anErrorOccurred')}`}`,
                });
                navigation.navigate('Login');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: `${error.response?.data?.error || `${t('anErrorOccurred')}`}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        // Add your logic for handling forgotten passwords here
        navigation.navigate('PasswordRetrieve');
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
                            placeholder={t('token')}
                            onChangeText={setToken}
                            value={token}
                            keyboardType="number-pad"
                            textContentType='oneTimeCode'
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
                                ) : <Icon name="eye" size={18} style={styles.eyeIcon} />}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordInput}>
                            <TextInput
                                style={styles.passwordTextInput}
                                placeholder={t('passwordConfirm')}
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                                secureTextEntry={!confirmPasswordVisible}
                                placeholderTextColor={globalStyles.placeholderText.color}
                            />
                            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                                {confirmPasswordVisible ? (
                                    <Icon name="eye-slash" size={18} style={styles.eyeIcon} />
                                ) : <Icon name="eye" size={18} style={styles.eyeIcon} />}
                            </TouchableOpacity>
                        </View>
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

export default PasswordRetrieveSecondStepScreen;
