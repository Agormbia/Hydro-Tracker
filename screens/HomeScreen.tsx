import React, { FC } from 'react';
import { useState, useEffect } from 'react';
import { 
	Text, 
	View, 
	TouchableOpacity,
	ScrollView,
	TextInput,
	Image,
	ViewStyle,
	TextStyle,
	ImageStyle,
	SafeAreaView,
	StatusBar
} from 'react-native';

import { homeStyles } from '../styles/homeStyles';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAchievements } from '../contexts/AchievementContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { useLanguage } from '../contexts/LanguageContext';
import CircularProgress from 'react-native-circular-progress-indicator';
import AchievementBadge from '../components/AchievementBadge';
import ProfilePanel from '../components/ProfilePanel';

interface Props {
	navigation: NativeStackNavigationProp<any>;
}

interface Achievement {
	id: number;
	completed: boolean;
}

interface AchievementNotification {
	title: string;
	icon: string;
}

interface DayData {
	intake: number;
}

interface DrinkOption {
	name: string;
	amount: number;
	icon: keyof typeof Ionicons.glyphMap;
	color: string;
}

const HomeScreen: FC<Props> = ({ navigation }) => {
	const [currentAchievement, setCurrentAchievement] = useState<AchievementNotification | null>(null);

	const [newGoal, setNewGoal] = useState<string>('');
	const [showGoalInput, setShowGoalInput] = useState(false);
	const [showProfilePanel, setShowProfilePanel] = useState(false);
	const [userName, setUserName] = useState('');
	const [userAvatar, setUserAvatar] = useState('https://i.pravatar.cc/150?img=1');
	const { isDarkMode } = useTheme();
	const { t } = useLanguage();
	const { currentUser, updateUserAvatar, updateUserScore, updateUserAchievements, resetUserStats } = useUser();
	const currentTheme = isDarkMode ? darkTheme : lightTheme;
	const { dailyGoal, todayIntake, logWaterIntake, updateDailyGoal, resetProgress, dailyData, streak, changeDate } = useWaterGoal();
	const { 
		achievements,
		checkFirstSip,
		checkDailyGoal,
		checkVolumeAchievements,
		checkAllDayHydrator,
		checkStreak,
		checkPerfectMonth,
		checkSeasonalSipper,
		checkGoalSmasher,
		checkWeekendWarrior,
		checkHydrationChallenge,
		checkBadgeCollector,
		checkMorningHydrator,
		checkNightOwl,
		setOnAchievementUnlock
	} = useAchievements();


	useEffect(() => {
		if (currentUser) {
			setUserName(currentUser.username);
			setUserAvatar(currentUser.avatar);
		}
	}, [currentUser]);



	useEffect(() => {
		const loadData = async () => {
			const storedGoal = await AsyncStorage.getItem('dailyWaterGoal');
			if (storedGoal) {
				const goal = parseInt(storedGoal);
				if (goal !== dailyGoal) {
					await updateDailyGoal(goal);
				}
			}
		};
		loadData();
	}, [dailyGoal]);

	const percentage = Math.min(100, (todayIntake / dailyGoal) * 100);
	const isGoalCompleted = todayIntake >= dailyGoal;
	const remaining = isGoalCompleted ? 0 : dailyGoal - todayIntake;

	const drinkOptions = [
		{ name: t('water'), amount: 250, icon: 'water-outline' as const, color: '#E3F2FD' },
		{ name: t('tea'), amount: 180, icon: 'cafe-outline' as const, color: '#FFF3E0' },
		{ name: t('beverage'), amount: 420, icon: 'beer-outline' as const, color: '#E8F5E9' },
		{ name: t('water'), amount: 500, icon: 'water-outline' as const, color: '#E3F2FD' }
	];


	const handleAchievement = React.useCallback((title: string, icon: string) => {
		setCurrentAchievement({ title, icon });
	}, []);

	useEffect(() => {
		setOnAchievementUnlock(handleAchievement);
		
		return () => {
			setOnAchievementUnlock(() => {});
		};
	}, [handleAchievement, setOnAchievementUnlock]);





	const handleDrinkOption = async (amount: number) => {
		try {
			const prevIntake = todayIntake;
			await logWaterIntake(amount);
			const newAmount = todayIntake + amount;
			
			// Update user's total water intake score
			if (currentUser) {
				const totalScore = currentUser.score + amount;
				await updateUserScore(currentUser.username, totalScore);
			}
			
			const now = new Date();

			// Check achievements and show notifications
			await checkFirstSip(newAmount);
			await checkDailyGoal(newAmount, dailyGoal);
			
			const totalVolume = dailyData.reduce((sum: number, day: DayData) => sum + day.intake, 0) + newAmount;
			await checkVolumeAchievements(newAmount, totalVolume);

			const hasMorningLog = now.getHours() < 9;
			const hasAfternoonLog = now.getHours() >= 12 && now.getHours() < 17;
			const hasEveningLog = now.getHours() >= 17;
			
			if (hasMorningLog) {
				await checkMorningHydrator(1);
			}
			if (now.getHours() >= 21) {
				await checkNightOwl(1);
			}

			await checkAllDayHydrator(hasMorningLog, hasAfternoonLog, hasEveningLog);

			// Only check streak-based achievements after goal completion
			if (newAmount >= dailyGoal && prevIntake < dailyGoal) {
				await checkStreak(streak);
				await checkPerfectMonth(streak);
				await checkSeasonalSipper(streak);
				await checkGoalSmasher(streak);
				await checkHydrationChallenge(streak);
			}

			await checkWeekendWarrior(now);
			await checkBadgeCollector();




		} catch (error) {
			console.error('Error logging water intake:', error);
		}
	};



	const handleUpdateGoal = async () => {
		const updatedGoal = parseInt(newGoal);
		if (updatedGoal > 0) {
			await updateDailyGoal(updatedGoal);
			setShowGoalInput(false);
			setNewGoal('');
		}
	};

	const handleReset = async () => {
		try {
			await resetProgress();
		} catch (error) {
			console.error('Error resetting progress:', error);
		}
	};






	const handleProfileUpdate = async (newName: string, newAvatar: string) => {

		try {
			if (currentUser) {
				await updateUserAvatar(currentUser.username, newAvatar);
				setUserAvatar(newAvatar);
			}
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};


	return (
		<SafeAreaView style={[homeStyles.container, { backgroundColor: currentTheme.colors.background }]}>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={currentTheme.colors.background}
				translucent={true}
			/>
			{currentAchievement && (
				<View style={homeStyles.achievementBadge}>
					<AchievementBadge
						title={currentAchievement.title}
						icon={currentAchievement.icon}
						onHide={() => setCurrentAchievement(null)}
					/>
				</View>
			)}
			<ScrollView 
				contentContainerStyle={homeStyles.contentContainer}
				showsVerticalScrollIndicator={true}
			>
				<View style={homeStyles.innerContainer}>


			<View style={homeStyles.header}>
				<Text style={[homeStyles.title, { color: currentTheme.colors.text }]}>
					{t('currentHydration')}
				</Text>
				<TouchableOpacity
					style={homeStyles.iconButton}
					onPress={() => setShowProfilePanel(true)}
				>
					<Image 
						source={{ uri: userAvatar }} 
						style={homeStyles.profileImage}
					/>
				</TouchableOpacity>
				<ProfilePanel
					visible={showProfilePanel}
					onClose={() => setShowProfilePanel(false)}
					theme={currentTheme}
					onUpdate={handleProfileUpdate}
				/>
			</View>



			<View style={homeStyles.progressContainer}>
				<CircularProgress
					value={percentage}
					radius={120}
					duration={1000}
					progressValueColor={currentTheme.colors.text}
					maxValue={100}
					title={`${todayIntake}ml`}
					titleColor={currentTheme.colors.text}
					titleStyle={{ fontWeight: 'bold' }}
					subtitle={isGoalCompleted ? "Goal Completed!" : `${remaining}ml remaining`}
					subtitleColor={currentTheme.colors.textSecondary}
					activeStrokeColor={currentTheme.colors.primary}
					inActiveStrokeColor={currentTheme.colors.border}
					inActiveStrokeOpacity={0.2}
					activeStrokeWidth={15}
					inActiveStrokeWidth={15}
				/>
			</View>

			<View style={homeStyles.optionsContainer}>
				{drinkOptions.map((option, index) => (
					<View key={index} style={homeStyles.optionButton}>
						<TouchableOpacity
							style={[
								homeStyles.optionButtonInner,
								{ 
									backgroundColor: option.color,
									opacity: isGoalCompleted ? 0.5 : 1 
								}
							]}
							onPress={() => handleDrinkOption(option.amount)}
							disabled={isGoalCompleted}
						>
							<Ionicons 
								name={option.icon} 
								size={24} 
								color={currentTheme.colors.primary}
								style={{ opacity: isGoalCompleted ? 0.5 : 1 }}
							/>
							<Text style={[
								homeStyles.optionText, 
								{ 
									color: currentTheme.colors.text,
									opacity: isGoalCompleted ? 0.5 : 1 
								}
							]}>
								{option.name}
							</Text>
							<Text style={[
								homeStyles.optionAmount, 
								{ 
									color: currentTheme.colors.textSecondary,
									opacity: isGoalCompleted ? 0.5 : 1 
								}
							]}>
								{option.amount}ml
							</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>

			{isGoalCompleted && (
				<>
					<Text style={[homeStyles.completionText, { color: currentTheme.colors.primary }]}>
						{t('goalReachedMessage')}
					</Text>
					<View style={homeStyles.buttonsContainer}>
						{!showGoalInput ? (
							<>
								<TouchableOpacity
									style={[homeStyles.updateButton, { backgroundColor: currentTheme.colors.primary }]}
									onPress={() => setShowGoalInput(true)}
								>
									<Text style={homeStyles.buttonText}>{t('updateGoal')}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[homeStyles.resetButton, { backgroundColor: currentTheme.colors.danger }]}
									onPress={handleReset}
								>
									<Text style={homeStyles.resetButtonText}>{t('resetProgress')}</Text>
								</TouchableOpacity>
							</>
						) : (
							<View style={homeStyles.goalInputContainer}>
								<TextInput
									style={[homeStyles.goalInput, { 
										color: currentTheme.colors.text,
										borderColor: currentTheme.colors.border 
									}]}
									value={newGoal}
									onChangeText={setNewGoal}
									placeholder={t('enterNewGoal')}
									placeholderTextColor={currentTheme.colors.textSecondary}
									keyboardType="numeric"
								/>
								<TouchableOpacity
									style={[homeStyles.updateButton, { backgroundColor: currentTheme.colors.primary }]}
									onPress={handleUpdateGoal}
								>
									<Text style={homeStyles.buttonText}>{t('confirm')}</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</>
			)}
		</View>
	</ScrollView>
</SafeAreaView>
	);
}




export default HomeScreen;


