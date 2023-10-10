import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider } from './src/context/AuthContext';
import { TranslationProvider } from './src/context/TranslationContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <TranslationProvider>
          <AppNavigator />
        </TranslationProvider>
        <Toast />
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
