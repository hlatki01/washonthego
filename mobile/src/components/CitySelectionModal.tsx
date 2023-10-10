import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

const cities = ['Irati, Paraná', 'Imbituva, Paraná', 'Rebouças, Paraná', 'Rio Azul, Paraná'];

const CitySelectionModal = ({ visible, onClose, onSave }) => {
    const { t } = useTranslation();

    const [selectedCity, setSelectedCity] = React.useState('');

    const handleSave = () => {
        if (selectedCity !== '') {
            onSave(selectedCity);
            onClose();
        }
    };
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.pickerContainer}>
                        <Text style={{ textAlign: 'center' }}>{t('selectYourCity')}</Text>
                        <Picker
                            selectedValue={selectedCity}
                            onValueChange={(itemValue) => setSelectedCity(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label={t('select')} value="" />
                            {cities.map((city, index) => (
                                <Picker.Item label={city} value={city} key={index} />
                            ))}
                        </Picker>
                    </View>
                    <TouchableOpacity onPress={handleSave} style={[styles.saveButton, selectedCity === "" && styles.disabledButton]} disabled={selectedCity === ""}>
                        <Text style={styles.buttonText}>{t('submit')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 300, // Set a fixed width for the modal content
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    pickerContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 200,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#0C5298',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#D3D3D3', // Use a different color for disabled state
    },
};

export default CitySelectionModal;
