import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
	const { isDarkMode } = useTheme();
	const currentTheme = isDarkMode ? darkTheme : lightTheme;
	const fadeAnim = new Animated.Value(0);

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1500,
			useNativeDriver: true,
		}).start();
	}, []);

	return (
		<View style={styles.container}>
			<Animated.Image 
				source={require('../assets/splash.jpg')} 
				style={[
					styles.splashImage,
					{ opacity: fadeAnim }
				]} 
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	splashImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
});


export default SplashScreen;