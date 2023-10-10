import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use any icon set you prefer

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const routesToNotDisplay = ['Categories', 'Settings'];

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const routeTitle = options.title || route.name; // Use options.title if available, else use route name
                const iconName = options.customIcon.props.name || 'circle'; // Use options.iconName if available, else default to 'circle'

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const iconColor = isFocused ? 'white' : 'lightgray';

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={routesToNotDisplay.includes(route.name) ? { display: 'none' } : styles.tabBarButton}
                    >
                        <Icon name={iconName} size={24} color={iconColor} />
                        <Text style={{ color: iconColor, marginTop: 4 }}>{routeTitle}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 80,
        backgroundColor: '#0C5298',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabBarButton: {
        flex: 1,
        alignItems: 'center',
    },
});

export default CustomTabBar;
