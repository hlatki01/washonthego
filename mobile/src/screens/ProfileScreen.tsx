import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import ContentContainer from '../components/ContentContainer';
import LoadingComponent from '../components/LoadingComponent';
import { getUserData, updateUserData } from '../services/UserService'; // Assuming you have functions for fetching and updating user data
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { API_ENDPOINT } from '@env';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserData();
                console.log(data);

                setUserData(data);
                setName(data.name);
                setEmail(data.email);
                if (data.photo && data.photo !== null) {
                    console.log('teste');

                    setPhoto(`${API_ENDPOINT}/files/${data.photo}`);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const selectImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    const takeNewPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    const handleSave = async () => {
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: `As senhas precisam ser iguais.`,
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);

            if (photo) {
                const uriParts = photo.split('.');
                const fileType = uriParts[uriParts.length - 1];
                formData.append('file', {
                    uri: photo,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

            const response = await updateUserData(formData);

            if (response) {
                setName(response.name);
                setEmail(response.email);
                setPhoto(`${API_ENDPOINT}/files/${response.photo}`);

                Toast.show({
                    type: 'success',
                    text1: `${t('success')}`,
                    text2: `${t('updateSuccess')}`,
                });
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            Toast.show({
                type: 'error',
                text1: `${t('error')}`,
                text2: `${error.response?.data?.error || `${t('anErrorOccurred')}`}`,
            });
        }
    };

    return (
        <ContentContainer>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('myProfile')}</Text>
                </View>

                {isLoading && (
                    <LoadingComponent />
                )}

                {!isLoading && userData && (
                    <View style={styles.profileContainer}>
                        {photo ? (
                            <Image
                                source={{ uri: photo }}
                                style={styles.photo}
                            />
                        ) : (
                            <Icon name="user-circle-o" size={100} color="#ccc" />
                        )}

                        <View style={styles.imagePickerButtonsContainer}>
                            <TouchableOpacity onPress={selectImageFromGallery} style={styles.imagePickerButtons}>
                                <Icon name="photo" size={35} color="#0C5298" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takeNewPhoto} style={styles.imagePickerButtons}>
                                <Icon name="camera" size={35} color="#0C5298" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder={t('name')}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email')}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />

                        <View style={styles.passwordInput}>
                            <TextInput
                                style={styles.passwordTextInput}
                                placeholder={t('password')}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                {isPasswordVisible ? (
                                    <Icon name="eye-slash" size={18} style={styles.eyeIcon} />
                                ) : <Icon name="eye" size={18} style={styles.eyeIcon} />}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.passwordInput}>
                            <TextInput
                                style={styles.passwordTextInput}
                                placeholder={t('passwordConfirm')}
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                                secureTextEntry={!isConfirmPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                {isConfirmPasswordVisible ? (
                                    <Icon name="eye-slash" size={18} style={styles.eyeIcon} />
                                ) : <Icon name="eye" size={18} style={styles.eyeIcon} />}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleSave} style={styles.button}>
                            <Text style={styles.buttonText}>{t('submit')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </ContentContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#0C5298"

    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    imagePickerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    imagePickerButtons: {
        padding: 15
    },
    photo: {
        width: 180,
        height: 180,
        borderRadius: 180,
        marginBottom: 10,
    },
    input: {
        width: '80%',
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0C5298',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
    },
    passwordTextInput: {
        flex: 1,
    },
    eyeIcon: {
        marginHorizontal: 10,
        color: '#0C5298',
    },
});

export default ProfileScreen;
