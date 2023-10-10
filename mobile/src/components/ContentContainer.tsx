import React from 'react';
import { View, Text } from 'react-native';
import { globalContentStyles } from '../styles/styles'; // Import your global styles

const ContentContainer = ({ children }) => {
    return (
        <View style={globalContentStyles.container}>
            {children}
        </View>
    );
};

export default ContentContainer;
