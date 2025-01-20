import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

interface Props {
	onPress: () => void;
}

const LanguageSelector = ({ onPress }: Props) => {
	const { isDarkMode } = useTheme();
	const theme = isDarkMode ? darkTheme : lightTheme;

	return (
		<TouchableOpacity 
			style={[styles.container]}
			onPress={onPress}
		>
			<Ionicons 
				name="language" 
				size={24} 
				color={theme.colors.primary}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 40,
		right: 20,
		padding: 10,
		zIndex: 1,
	},
});


export default LanguageSelector;