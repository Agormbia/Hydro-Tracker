import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAchievements } from '../contexts/AchievementContext';
import { achievementsStyles } from '../styles/achievementsStyles';


export default function AchievementsScreen() {
	const { isDarkMode } = useTheme();
	const currentTheme = isDarkMode ? darkTheme : lightTheme;
	const { achievements } = useAchievements();
	const { t } = useLanguage();

	const { groupedAchievements, totalPoints, categoryProgress } = React.useMemo(() => {
		// Debug logging
		console.log('All achievements:', achievements.map(a => ({
			id: a.id,
			title: a.title,
			category: a.category,
			completed: a.completed
		})));

		// Group achievements
		const groups: { [key: string]: typeof achievements } = {};
		achievements.forEach(achievement => {
			if (!groups[achievement.category]) {
				groups[achievement.category] = [];
			}
			groups[achievement.category].push(achievement);
		});

		// Calculate total points
		const total = achievements.reduce((sum, a) => sum + (a.completed ? a.points : 0), 0);
		
		// Calculate category progress
		const progress: { [key: string]: { completed: number; total: number } } = {};
		Object.entries(groups).forEach(([category, items]) => {
			progress[category] = {
				completed: items.filter(a => a.completed).length,
				total: items.length
			};
		});

		return { 
			groupedAchievements: groups, 
			totalPoints: total, 
			categoryProgress: progress 
		};
	}, [achievements]);

	return (
		<ScrollView style={[achievementsStyles.container, { backgroundColor: currentTheme.colors.background }]}>
			<Text style={[achievementsStyles.title, { color: currentTheme.colors.primary }]}>{t('achievementsTitle')}</Text>
			<Text style={{ color: currentTheme.colors.text }}>
				{t('totalAchievements')}: {achievements.length}
			</Text>
			<View style={achievementsStyles.totalPoints}>
				<Text style={[achievementsStyles.totalPointsText, { color: currentTheme.colors.text }]}>
					{t('totalPoints')}: {totalPoints}
				</Text>
			</View>

			{Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
				<View key={category}>
					<View style={achievementsStyles.categoryHeader}>
						<Text style={[achievementsStyles.categoryTitle, { color: currentTheme.colors.primary }]}>
							{t(`achievements.categories.${category}`)}
						</Text>
						<Text style={[achievementsStyles.categoryProgress, { color: currentTheme.colors.textSecondary }]}>
							{categoryProgress[category].completed}/{categoryProgress[category].total}
						</Text>
					</View>
					<View style={achievementsStyles.badgeContainer}>
						{categoryAchievements.map((achievement) => (
							<View 
								key={achievement.id}
								style={[achievementsStyles.badge, { 
									backgroundColor: currentTheme.colors.surface,
									borderColor: achievement.completed ? currentTheme.colors.success : currentTheme.colors.border,
								}]}
							>
								<Ionicons 
									name={achievement.icon as any}
									size={32}
									color={achievement.completed ? currentTheme.colors.success : currentTheme.colors.textSecondary}
								/>
								<Text style={[achievementsStyles.badgeTitle, { color: currentTheme.colors.text }]}>
									{t(`achievements.titles.${achievement.title}`)}
								</Text>
								<Text style={[achievementsStyles.badgeDescription, { color: currentTheme.colors.textSecondary }]}>
									{t(`achievements.descriptions.${achievement.description}`)}
								</Text>
								<View style={achievementsStyles.badgeFooter}>
									<Text style={[achievementsStyles.points, { color: currentTheme.colors.primary }]}>
										{achievement.points} {t('points')}
									</Text>
									{achievement.completed && (
										<Ionicons 
											name="checkmark-circle"
											size={20}
											color={currentTheme.colors.success}
										/>
									)}
								</View>
							</View>
						))}
					</View>
				</View>
			))}
		</ScrollView>
	);
}



