import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const COLORS = {
    // Brand
    primary: '#FF6B35',
    primaryDark: '#E55A28',
    secondary: '#2D3748',

    // Light theme
    light: {
        background: '#F7F8FA',
        card: '#FFFFFF',
        text: '#1A202C',
        subtext: '#718096',
        border: '#E2E8F0',
        inputBg: '#FFFFFF',
        tabBar: '#FFFFFF',
        headerBg: '#FFFFFF',
    },
    // Dark theme
    dark: {
        background: '#0F1117',
        card: '#1A1D27',
        text: '#F7FAFC',
        subtext: '#A0AEC0',
        border: '#2D3748',
        inputBg: '#1A1D27',
        tabBar: '#13151F',
        headerBg: '#13151F',
    },
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const toggleTheme = () => setIsDark((prev) => !prev);
    const theme = isDark ? COLORS.dark : COLORS.light;

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme, COLORS }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
