import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const EditItemComponent = ({ item, isVisible, onSave, onCancel }) => {
    const [editedItem, setEditedItem] = useState(item);

    const handleFieldChange = (fieldName, value) => {
        setEditedItem((prevItem) => ({
            ...prevItem,
            [fieldName]: value,
        }));
    };

    const handleSave = () => {
        onSave(editedItem);
    };

    const renderFields = () => {
        return Object.entries(editedItem).map(([field, value], index) => (
            <View key={index} style={styles.fieldContainer}>
                <Text style={styles.label}>{field}:</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => handleFieldChange(field, text)}
                />
            </View>
        ));
    };

    return (
        <Modal isVisible={isVisible} style={styles.modal}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Edit Item</Text>
                {renderFields()}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '95%',
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fieldContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    saveButton: {
        backgroundColor: 'green',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditItemComponent;
