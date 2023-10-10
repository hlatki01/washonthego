import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons from react-native-vector-icons
import { Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import CitySelectionModal from './CitySelectionModal';


const CustomHeaderComponent = () => {
    const { t } = useTranslation();

    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);

    const { signOut, setCurrentCity } = useAuth()

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleDrawerButtonClick = () => {
        toggleModal();
    };

    const handleLogout = () => {
        signOut()
        navigation.navigate('Login')
        toggleModal();
    };

    const handleBackButtonClick = () => {
        navigation.goBack();
    };

    const handleMenuItemClick = (screenName) => {
        navigation.navigate(screenName);
        toggleModal();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBackButtonClick} style={styles.icon}>
                <Icon name="arrow-left" size={24} color='#0C5298' style={styles.backButton} />
            </TouchableOpacity>

            <View style={styles.spacer} />
            <TouchableOpacity onPress={handleDrawerButtonClick} style={styles.icon}>
                <MaterialCommunityIcons name="dots-vertical" size={24} style={styles.backButton} />
            </TouchableOpacity>
            <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={toggleModal}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={toggleModal}>
                        <Icon name="close" size={24} style={styles.closeButton} />
                    </TouchableOpacity>
                    {/* 
                    */}

                    <TouchableOpacity style={styles.modalItemContainer} onPress={() => handleMenuItemClick('Settings')}>
                        <MaterialCommunityIcons name="cog" size={24} style={styles.icon} />
                        <Text style={styles.modalItem}>Configurações</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.modalItemContainer} onPress={handleLogout}>
                        <MaterialCommunityIcons name="exit-to-app" size={24} style={styles.iconLogout} />
                        <Text style={styles.modalItemLogout}>{t('logout')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>

    );
};

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? 20 : 60, // Adjust paddingTop for Android
        marginTop: 35,
        alignItems: 'center',
    },
    spacer: {
        flex: 1,
    },
    icon: {
    },
    iconLogout: {
        color: "#0C5298",
    },
    backButton: {
        padding: 10,
        borderRadius: 14,
        borderColor: '#0C5298',
        color: '#0C5298',
    },
    modalContainer: {
        flex: 1, // Use flex: 1 to cover the entire screen
        backgroundColor: 'white',
        padding: 25,
        marginTop: 55
    },
    modalItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    modalItem: {
        fontSize: 14,
        marginLeft: 10,
    },
    modalItemLogout: {
        fontSize: 14,
        marginLeft: 10,
        color: '#0C5298',
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginVertical: 10,
    },
    closeButton: {
        fontSize: 25,
        color: 'lightgray',
        alignSelf: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#0C5298',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
};
export default CustomHeaderComponent;
