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
	const translateY = new Animated.Value(-100);
	const opacity = new Animated.Value(0);

	useEffect(() => {
		Animated.sequence([
			Animated.parallel([
				Animated.timing(translateY, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
					easing: Easing.out(Easing.back(1.5)),
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
			]),
			Animated.delay(2000),
			Animated.parallel([
				Animated.timing(translateY, {
					toValue: -100,
					duration: 500,
					useNativeDriver: true,
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
					transform: [{ translateY }],
					opacity,
					backgroundColor: isDarkMode ? '#333' : '#fff',
				},
			]}
		>
			<View style={styles.content}>
				<Ionicons name={icon as any} size={24} color="#FFD700" />
				<View style={styles.textContainer}>
					<Text style={styles.title}>{t('achievementUnlocked')}</Text>
					<Text style={styles.achievement}>{title}</Text>
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
		padding: 16,
		margin: 16,
		borderRadius: 12,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 1000,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	textContainer: {
		marginLeft: 12,
		flex: 1,
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#FFD700',
	},
	achievement: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 4,
		color: '#666',
	},
});

export default AchievementBadge;