import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../styles/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: ThemeMode) => void;
	isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [themeMode, setThemeMode] = useState<ThemeMode>('system');
	const [isDarkMode, setIsDarkMode] = useState(false);
	const systemColorScheme = useColorScheme();

	useEffect(() => {
		loadTheme();
	}, []);

	useEffect(() => {
		updateDarkMode();
	}, [themeMode, systemColorScheme]);

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem('theme');
			if (savedTheme) {
				setThemeMode(savedTheme as ThemeMode);
			}
		} catch (error) {
			console.error('Error loading theme:', error);
		}
	};

	const updateDarkMode = () => {
		if (themeMode === 'system') {
			setIsDarkMode(systemColorScheme === 'dark');
		} else {
			setIsDarkMode(themeMode === 'dark');
		}
	};

	const handleThemeChange = async (newTheme: ThemeMode) => {
		setThemeMode(newTheme);
		try {
			await AsyncStorage.setItem('theme', newTheme);
		} catch (error) {
			console.error('Error saving theme:', error);
		}
	};

	const theme = isDarkMode ? darkTheme : lightTheme;

	return (
		<ThemeContext.Provider value={{ theme, setTheme: handleThemeChange, isDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};