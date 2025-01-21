import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AchievementBadgeProps {
	title: string;
	icon: string;
	onHide: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ title, icon, onHide }) => {
	const { isDarkMode } = useTheme();
	const { t } = useLanguage();
	const translateY = new Animated.Value(-150); // Increased initial offset for better entry
	const opacity = new Animated.Value(0);
	const scale = new Animated.Value(1);

	useEffect(() => {
		// Create pulse animation
		const pulseAnimation = Animated.sequence([
			Animated.timing(scale, {
				toValue: 1.05,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(scale, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			})
		]);

		// Create repeating pulse
		const repeatingPulse = Animated.loop(pulseAnimation, {
			iterations: 5 // Will pulse 5 times during display
		});

		// Main animation sequence
		Animated.sequence([
			Animated.parallel([
				Animated.timing(translateY, {
					toValue: 0,
					duration: 600,
					useNativeDriver: true,
					easing: Easing.out(Easing.back(2)), // Increased bounce effect
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
			]),
			Animated.parallel([
				repeatingPulse,
				Animated.delay(3000), // Reduced to 3 seconds for faster feedback
			]),
			Animated.parallel([
				Animated.timing(translateY, {
					toValue: -150,
					duration: 600,
					useNativeDriver: true,
					easing: Easing.in(Easing.ease),
				}),
				Animated.timing(opacity, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
			]),
		]).start(() => onHide());
	}, []);

	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [
						{ translateY },
						{ scale }
					],
					opacity,
					backgroundColor: isDarkMode ? '#2D2D2D' : '#F8F8F8',
					borderLeftWidth: 4,
					borderLeftColor: '#4CAF50', // Green accent
				},
			]}
		>
			<View style={styles.content}>
				<Ionicons name={icon as any} size={24} color="#4CAF50" />
				<View style={styles.textContainer}>
					<Text style={[styles.title, { color: isDarkMode ? '#81C784' : '#4CAF50' }]}>
						{t('achievementUnlocked')}
					</Text>
					<Text style={[styles.achievement, { color: isDarkMode ? '#E0E0E0' : '#333' }]}>
						{title}
					</Text>
				</View>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		padding: 12,
		margin: 12,
		marginTop: 0,
		borderRadius: 8,
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		zIndex: 1000,
		borderWidth: 1,
		borderLeftWidth: 4,
		borderColor: 'rgba(255, 215, 0, 0.5)', // More visible gold border
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingVertical: 4,
	},
	textContainer: {
		marginLeft: 12,
		flex: 1,
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#4CAF50', // Green color for success
		textShadowColor: 'rgba(0, 0, 0, 0.1)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	achievement: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 2,
		color: '#333',
	},
});

export default AchievementBadge;