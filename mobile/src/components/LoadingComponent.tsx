import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingComponent = ({ color }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={color ? color : '#00293f'} />
            <Text style={{ marginTop: 10, fontSize: 16, color: color ? color : '#00293f' }}>{t('loading')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default LoadingComponent;
