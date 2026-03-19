import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function Root() {
  const { isDark, theme } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.headerBg} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Root />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
