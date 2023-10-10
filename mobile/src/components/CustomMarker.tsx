import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CustomMarker = ({ company, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(company)}>
            <View style={styles.markerContainer}>
                <Image
                    source={require('../../assets/pin.png')} // Your marker icon
                    style={styles.markerIcon}
                    resizeMode="contain"
                />
                {/* You can customize the content inside the marker if needed */}
                <View style={styles.markerContent}>
                    <Text>{company.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
    },
    markerIcon: {
        height: 45,
        width: 45,
    },
    markerContent: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
    },
});

export default CustomMarker;
