import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CompanyModal = ({ isVisible, company, onClose, onStartNavigation, onOpenWhatsApp, onFavoritePress, isFavorited, isLoadingOnModal }) => {
    const { t } = useTranslation();

    if (!isVisible || !company) {
        return null;
    }

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="close" size={25} color="lightgray" />
                    </TouchableOpacity>
                    {isLoadingOnModal ? (
                        <Text style={styles.modalTitle}>Aguarde...</Text>
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>
                                {company.name}
                                <TouchableOpacity onPress={() => onFavoritePress(company)}>
                                    <Icon name="star" size={20} color={isFavorited ? 'yellow' : 'lightgray'} style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </Text>
                            <Text>{company.phone}</Text>
                            <Text>{company.address}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.navigationButton} onPress={() => onStartNavigation(company)}>
                                    <Icon name="car" size={20} color="#FFF" />
                                    <Text style={styles.buttonText}>{t('navigate')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.whatsappButton} onPress={() => onOpenWhatsApp(company)}>
                                    <Icon name="whatsapp" size={20} color="#FFF" />
                                    <Text style={styles.buttonText}>WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    navigationButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    whatsappButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#25D366',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 5,
        color: '#FFF',
    },
});

export default CompanyModal;
