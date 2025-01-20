import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../translations';

export type Language = 'en' | 'es' | 'fr';

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	toggleLanguage: () => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [language, setLanguage] = useState<Language>('en');

	const toggleLanguage = () => {
		const languages: Language[] = ['en', 'es', 'fr'];
		const currentIndex = languages.indexOf(language);
		const nextIndex = (currentIndex + 1) % languages.length;
		handleLanguageChange(languages[nextIndex]);
	};

	useEffect(() => {
		loadLanguage();
	}, []);

	const loadLanguage = async () => {
		try {
			const savedLanguage = await AsyncStorage.getItem('language');
			if (savedLanguage) {
				setLanguage(savedLanguage as Language);
			}
		} catch (error) {
			console.error('Error loading language:', error);
		}
	};

	const handleLanguageChange = async (newLanguage: Language) => {
		setLanguage(newLanguage);
		try {
			await AsyncStorage.setItem('language', newLanguage);
		} catch (error) {
			console.error('Error saving language:', error);
		}
	};

	const t = (key: string): string => {
		const keys = key.split('.');
		let value: any = translations[language];
		
		// Try to get value from current language
		for (const k of keys) {
			if (!value || typeof value !== 'object') {
				break;
			}
			value = value[k];
		}
		
		// If value not found or is an object, try English fallback
		if (!value || typeof value === 'object') {
			value = translations.en;
			for (const k of keys) {
				if (!value || typeof value !== 'object') {
					break;
				}
				value = value[k];
			}
		}
		
		return typeof value === 'string' ? value : key;
	};

	return (
		<LanguageContext.Provider value={{ 
			language, 
			setLanguage: handleLanguageChange, 
			toggleLanguage,
			t 
		}}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};