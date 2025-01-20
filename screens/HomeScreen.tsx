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
	ImageStyle
} from 'react-native';

import { homeStyles } from '../styles/homeStyles';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAchievements } from '../contexts/AchievementContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { useTheme } from '../contexts/ThemeContext';
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
	const [shownAchievements, setShownAchievements] = useState<Set<number>>(new Set());
	const [newGoal, setNewGoal] = useState<string>('');
	const [showGoalInput, setShowGoalInput] = useState(false);
	const [showProfilePanel, setShowProfilePanel] = useState(false);
	const [userName, setUserName] = useState('');
	const [userAvatar, setUserAvatar] = useState('https://i.pravatar.cc/150?img=1');
	const { isDarkMode } = useTheme();

	const { t } = useLanguage();
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
		checkNightOwl
	} = useAchievements();


	useEffect(() => {
		const loadProfile = async () => {
			try {
				const savedName = await AsyncStorage.getItem('userName');
				const savedAvatar = await AsyncStorage.getItem('userAvatar');
				if (savedName) setUserName(savedName);
				if (savedAvatar) setUserAvatar(savedAvatar);
			} catch (error) {
				console.error('Error loading profile:', error);
			}
		};
		loadProfile();
	}, []);


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


	// Create a function to handle achievement unlocks
	const handleAchievementUnlock = (title: string, icon: string, id: number): void => {
		if (!shownAchievements.has(id)) {
			setCurrentAchievement({ title, icon });
			setShownAchievements((prev: Set<number>) => new Set([...prev, id]));
		}
	};

	const handleDrinkOption = async (amount: number) => {
		try {
			const prevIntake = todayIntake;
			await logWaterIntake(amount);
			const newAmount = todayIntake + amount;
			const now = new Date();

			// Helper function to check if achievement is already completed
			const isAchievementCompleted = (id: number): boolean => {
				return achievements.find((a: Achievement) => a.id === id)?.completed || false;
			};

			// Basic achievements
			if (newAmount > 0 && prevIntake === 0 && !isAchievementCompleted(1)) {
				handleAchievementUnlock('First Sip', 'water-outline', 1);
			}
			if (newAmount >= dailyGoal && prevIntake < dailyGoal && !isAchievementCompleted(2)) {
				handleAchievementUnlock('Daily Goal Reached', 'trophy-outline', 2);
			}

			// Volume achievements
			if (newAmount >= 1000 && !isAchievementCompleted(8)) {
				handleAchievementUnlock('1-Liter Club', 'beaker-outline', 8);
			}

			// Time-based achievements
			const hour = now.getHours();
			if (hour < 9 && !isAchievementCompleted(12)) {
				handleAchievementUnlock('Early Bird', 'sunny-outline', 12);
			}
			if (hour >= 21 && !isAchievementCompleted(13)) {
				handleAchievementUnlock('Night Owl', 'moon-outline', 13);
			}

			// Weekend achievement
			if ([0, 6].includes(now.getDay()) && !isAchievementCompleted(7)) {
				handleAchievementUnlock('Weekend Warrior', 'calendar-outline', 7);
			}

			// Call achievement checks
			checkFirstSip(newAmount);
			checkDailyGoal(newAmount, dailyGoal);
			
			const totalVolume = dailyData.reduce((sum: number, day: DayData) => sum + day.intake, 0) + newAmount;
			checkVolumeAchievements(newAmount, totalVolume);

			const hasMorningLog = hour < 9;
			const hasAfternoonLog = hour >= 12 && hour < 17;
			const hasEveningLog = hour >= 17;
			
			if (hasMorningLog) {
				checkMorningHydrator(1);
			}
			if (hour >= 21) {
				checkNightOwl(1);
			}

			checkAllDayHydrator(hasMorningLog, hasAfternoonLog, hasEveningLog);

			// Only check streak-based achievements after goal completion
			if (newAmount >= dailyGoal && prevIntake < dailyGoal) {
				// Let the streak update in WaterGoalContext complete first
				setTimeout(() => {
					checkStreak(streak);
					checkPerfectMonth(streak);
					checkSeasonalSipper(streak);
					checkGoalSmasher(streak);
					checkHydrationChallenge(streak);
				}, 100);
			}

			checkWeekendWarrior(now);
			checkBadgeCollector();

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
			// Clear shown achievements and current notification
			setShownAchievements(new Set());
			setCurrentAchievement(null);


		} catch (error) {
			console.error('Error resetting progress:', error);
		}
	};

	const handleProfileUpdate = async (newName: string, newAvatar: string) => {
		try {
			await AsyncStorage.setItem('userName', newName);
			await AsyncStorage.setItem('userAvatar', newAvatar);
			setUserName(newName);
			setUserAvatar(newAvatar);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};


	return (

		<ScrollView 
			style={[homeStyles.container, { backgroundColor: currentTheme.colors.background }]}
			contentContainerStyle={homeStyles.contentContainer}
			showsVerticalScrollIndicator={true}
		>
			<View style={homeStyles.achievementBadge}>
				{currentAchievement && (
					<AchievementBadge
						title={currentAchievement.title}
						icon={currentAchievement.icon}
						onHide={() => setCurrentAchievement(null)}
					/>
				)}
			</View>
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
	);
}




export default HomeScreen;


