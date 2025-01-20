import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { statisticsStyles } from '../styles/statisticsStyles';
import { useTheme } from '../contexts/ThemeContext';

import { lightTheme, darkTheme } from '../styles/theme';
import { useLanguage } from '../contexts/LanguageContext';

import { useAchievements } from '../contexts/AchievementContext';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { LineChart, BarChart } from 'react-native-chart-kit';


interface DailyData {
	date: string;
	intake: number;
	goal: number;
	timeLog: { time: string; amount: number }[];
}

interface TimeDistribution {
	morning: number;
	afternoon: number;
	evening: number;
}

const StatisticsScreen: React.FC = () => {
	const { isDarkMode } = useTheme();
	const { t } = useLanguage();
	const { achievements } = useAchievements();
	const { dailyData: contextDailyData, bestStreak: contextBestStreak, resetProgress } = useWaterGoal();
	const currentTheme = isDarkMode ? darkTheme : lightTheme;
	const screenWidth = Dimensions.get('window').width;

	const [dailyData, setDailyData] = useState<DailyData[]>([]);
	const [averageIntake, setAverageIntake] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);
	const [goalCompletionRate, setGoalCompletionRate] = useState(0);
	const [achievementProgress, setAchievementProgress] = useState(0);
	const [timeDistribution, setTimeDistribution] = useState<TimeDistribution>({
		morning: 0,
		afternoon: 0,
		evening: 0,
	});
	const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

	useEffect(() => {
		loadStatistics();
	}, [contextDailyData]);

	const loadStatistics = async () => {
		try {
			// Reset all statistics if there's no data
			if (!contextDailyData || contextDailyData.length === 0) {
				setDailyData([]);
				setAverageIntake(0);
				setGoalCompletionRate(0);
				setTimeDistribution({
					morning: 0,
					afternoon: 0,
					evening: 0
				});
				return;
			}

			setDailyData(contextDailyData);
			
			// Calculate averages and stats
			const avg = contextDailyData.reduce((sum, day) => sum + day.intake, 0) / contextDailyData.length;
			setAverageIntake(avg);

			const completedDays = contextDailyData.filter(day => day.intake >= day.goal).length;
			setGoalCompletionRate((completedDays / contextDailyData.length) * 100);

			// Calculate time distribution
			calculateTimeDistribution(contextDailyData);

			// Update best streak from context
			setBestStreak(contextBestStreak);

			const completedAchievements = achievements.filter(a => a.completed).length;
			setAchievementProgress((completedAchievements / achievements.length) * 100);
		} catch (error) {
			console.error('Error loading statistics:', error);
		}
	};

	const calculateTimeDistribution = (data: DailyData[]) => {
		const distribution = data.reduce((acc, day) => {
			day.timeLog?.forEach(log => {
				const hour = parseInt(log.time.split(':')[0]);
				if (hour >= 5 && hour < 12) acc.morning += log.amount;
				else if (hour >= 12 && hour < 17) acc.afternoon += log.amount;
				else acc.evening += log.amount;
			});
			return acc;
		}, { morning: 0, afternoon: 0, evening: 0 });

		setTimeDistribution(distribution);
	};

	const getChartData = () => {
		const labels = selectedPeriod === 'week' 
			? dailyData.slice(-7).map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }))
			: dailyData.slice(-30).map(d => new Date(d.date).getDate().toString());

		const datasets = [{
			data: selectedPeriod === 'week'
				? dailyData.slice(-7).map(d => d.intake)
				: dailyData.slice(-30).map(d => d.intake)
		}];

		return { labels, datasets };
	};

	const chartConfig = {
		backgroundColor: currentTheme.colors.surface,
		backgroundGradientFrom: currentTheme.colors.surface,
		backgroundGradientTo: currentTheme.colors.surface,
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
		style: {
			borderRadius: 16,
		},
		propsForDots: {
			r: "6",
			strokeWidth: "2",
			stroke: currentTheme.colors.primary
		}
	};

	const renderStatCard = (title: string, value: string | number, unit: string = '') => (
		<View style={[statisticsStyles.statCard, { backgroundColor: currentTheme.colors.surface }]}>
			<Text style={[statisticsStyles.statTitle, { color: currentTheme.colors.textSecondary }]}>{title}</Text>
			<Text style={[statisticsStyles.statValue, { color: currentTheme.colors.text }]}>
				{value}{unit}
			</Text>
		</View>
	);

	const renderProgressBar = (value: number, maxValue: number) => (
		<View style={statisticsStyles.progressBarContainer}>
			<View style={[statisticsStyles.progressBar, { backgroundColor: currentTheme.colors.border }]}>
				<View 
					style={[
						statisticsStyles.progressFill, 
						{ 
							width: `${(value / maxValue) * 100}%`,
							backgroundColor: currentTheme.colors.primary 
						}
					]} 
				/>
			</View>
			<Text style={[statisticsStyles.progressText, { color: currentTheme.colors.text }]}>
				{value}ml / {maxValue}ml
			</Text>
		</View>
	);

	return (
		<ScrollView style={[statisticsStyles.container, { backgroundColor: currentTheme.colors.background }]}>
			<Text style={[statisticsStyles.title, { color: currentTheme.colors.primary }]}>{t('statistics')}</Text>

			<View style={statisticsStyles.statsGrid}>
				{renderStatCard(t('averageIntake'), `${averageIntake.toFixed(0)}`, 'ml')}
				{renderStatCard(t('bestStreak'), bestStreak, t('days'))}
				{renderStatCard(t('goalCompletion'), `${goalCompletionRate.toFixed(0)}`, '%')}
				{renderStatCard(t('achievementsTitle'), `${achievementProgress.toFixed(0)}`, '%')}
			</View>

			<View style={[statisticsStyles.section, { backgroundColor: currentTheme.colors.surface }]}>
				<Text style={[statisticsStyles.sectionTitle, { color: currentTheme.colors.primary }]}>{t('waterIntakeTrends')}</Text>
				<View style={statisticsStyles.periodToggle}>
					<TouchableOpacity 
						style={[
							statisticsStyles.periodButton, 
							selectedPeriod === 'week' && statisticsStyles.periodButtonActive
						]}
						onPress={() => setSelectedPeriod('week')}
					>
						<Text style={[statisticsStyles.periodButtonText, { color: currentTheme.colors.text }]}>{t('week')}</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[
							statisticsStyles.periodButton, 
							selectedPeriod === 'month' && statisticsStyles.periodButtonActive
						]}
						onPress={() => setSelectedPeriod('month')}
					>
						<Text style={[statisticsStyles.periodButtonText, { color: currentTheme.colors.text }]}>{t('month')}</Text>
					</TouchableOpacity>
				</View>
				
				<LineChart
					data={getChartData()}
					width={screenWidth - 40}
					height={220}
					chartConfig={chartConfig}
					bezier
					style={statisticsStyles.chart}
					yAxisLabel="ml "
					yAxisSuffix=""
					withInnerLines={true}
					withOuterLines={true}
					withDots={true}
					withShadow={false}
				/>
			</View>

			<View style={[statisticsStyles.section, { backgroundColor: currentTheme.colors.surface }]}>
				<Text style={[statisticsStyles.sectionTitle, { color: currentTheme.colors.primary }]}>{t('peakHydrationTimes')}</Text>
				<BarChart
					data={{
						labels: [t('morning'), t('afternoon'), t('evening')],
						datasets: [{
							data: [
								timeDistribution.morning || 0,
								timeDistribution.afternoon || 0,
								timeDistribution.evening || 0
							]
						}]
					}}
					width={screenWidth - 40}
					height={220}
					chartConfig={{
						...chartConfig,
						barPercentage: 0.7

					}}
					style={statisticsStyles.chart}
					showValuesOnTopOfBars={true}
					withInnerLines={false}
				/>
			</View>

			<View style={[statisticsStyles.section, { backgroundColor: currentTheme.colors.surface }]}>
				<Text style={[statisticsStyles.sectionTitle, { color: currentTheme.colors.primary }]}>{t('dailyProgress')}</Text>
				{dailyData
					.slice()
					.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
					.slice(0, 7)
					.map((day) => (
						<View key={day.date} style={statisticsStyles.dayContainer}>
							<View style={statisticsStyles.dayHeader}>
								<Text style={[statisticsStyles.dayText, { color: currentTheme.colors.text }]}>
									{new Date(day.date).toLocaleDateString()}
								</Text>
								<Text style={[statisticsStyles.percentageText, { 
									color: day.intake >= day.goal ? currentTheme.colors.primary : currentTheme.colors.textSecondary 
								}]}>
									{Math.min(100, Math.round((day.intake / day.goal) * 100))}%
								</Text>
							</View>
							{renderProgressBar(day.intake, day.goal)}
						</View>
					))
				}
			</View>

			<TouchableOpacity 
				style={[statisticsStyles.resetButton, { backgroundColor: currentTheme.colors.danger }]}
				onPress={async () => {
					try {
						await resetProgress();
					} catch (error) {
						console.error('Error resetting progress:', error);
					}
				}}
			>
				<Text style={statisticsStyles.resetButtonText}>{t('resetProgress')}</Text>
			</TouchableOpacity>

			</ScrollView>

	);
};

export default StatisticsScreen;
