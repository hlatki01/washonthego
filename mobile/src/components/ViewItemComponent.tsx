import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const ViewItemComponent = ({ item, isVisible, onClose }) => {
    return (
        <Modal isVisible={isVisible} style={styles.modal}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Item Details</Text>
                {Object.entries(item).map(([label, value], index) => (
                    <View key={index} style={styles.fieldContainer}>
                        <Text style={styles.label}>{label}:</Text>
                        <Text style={styles.fieldValue}>{value}</Text>
                    </View>
                ))}
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
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
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fieldContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    fieldValue: {
        flex: 2,
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ViewItemComponent;
