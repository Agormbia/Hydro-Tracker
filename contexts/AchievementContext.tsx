import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface Achievement {
	id: number;
	title: string;
	description: string;
	icon: string;
	completed: boolean;
	points: number;
	category: string;
}

interface AchievementContextType {
	achievements: Achievement[];
	unlockAchievement: (id: number) => void;
	checkFirstSip: (waterDrank: number) => void;
	checkDailyGoal: (waterDrank: number, goal: number) => void;
	checkStreak: (streak: number) => void;
	checkWeekendWarrior: (date: Date) => void;
	checkVolumeAchievements: (dailyVolume: number, totalVolume: number) => void;
	checkMorningHydrator: (consecutiveDays: number) => void;
	checkNightOwl: (consecutiveDays: number) => void;
	checkAllDayHydrator: (morningLog: boolean, afternoonLog: boolean, eveningLog: boolean) => void;
	checkHydrationChallenge: (completedDays: number) => void;
	checkHolidayHydrator: (isHoliday: boolean) => void;
	checkSeasonalSipper: (consecutiveDays: number) => void;
	checkBadgeCollector: () => void;
	checkPerfectMonth: (consecutiveDays: number) => void;
	checkGoalSmasher: (exceededDays: number) => void;
	resetAchievements: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const initialAchievements = [
	// Beginner Achievements
	{
		id: 1,
		title: 'firstSipTitle',
		description: 'firstSipDesc',
		icon: 'water-outline',
		completed: false,
		points: 10,
		category: 'categoryBeginner'
	},
	{
		id: 2,
		title: 'dailyDrinkerTitle',
		description: 'dailyDrinkerDesc',
		icon: 'trophy-outline',
		completed: false,
		points: 20,
		category: 'categoryBeginner'
	},
	{
		id: 3,
		title: 'hydrationStarterTitle',
		description: 'hydrationStarterDesc',
		icon: 'star-outline',
		completed: false,
		points: 30,
		category: 'categoryBeginner'
	},
	// Consistency Achievements
	{
		id: 4,
		title: 'weeklyWarriorTitle',
		description: 'weeklyWarriorDesc',
		icon: 'calendar-outline',
		completed: false,
		points: 50,
		category: 'categoryConsistency'
	},
	{
		id: 5,
		title: 'thirstCrusherTitle',
		description: 'thirstCrusherDesc',
		icon: 'flame-outline',
		completed: false,
		points: 75,
		category: 'categoryConsistency'
	},
	{
		id: 6,
		title: 'hydrationStreakerTitle',
		description: 'hydrationStreakerDesc',
		icon: 'ribbon-outline',
		completed: false,
		points: 100,
		category: 'categoryConsistency'
	},
	{
		id: 7,
		title: 'weekendWinnerTitle',
		description: 'weekendWinnerDesc',
		icon: 'calendar-number-outline',
		completed: false,
		points: 40,
		category: 'categoryConsistency'
	},
	// Volume-Based Achievements
	{
		id: 8,
		title: 'literClubTitle',
		description: 'literClubDesc',
		icon: 'beaker-outline',
		completed: false,
		points: 25,
		category: 'categoryVolume'
	},
	{
		id: 9,
		title: 'hydrationHeroTitle',
		description: 'hydrationHeroDesc',
		icon: 'trophy-outline',
		completed: false,
		points: 50,
		category: 'categoryVolume'
	},
	{
		id: 10,
		title: 'waterChampionTitle',
		description: 'waterChampionDesc',
		icon: 'medal-outline',
		completed: false,
		points: 100,
		category: 'categoryVolume'
	},
	{
		id: 11,
		title: 'oceanOverlordTitle',
		description: 'oceanOverlordDesc',
		icon: 'water-outline',
		completed: false,
		points: 500,
		category: 'categoryVolume'
	},
	// Time-Based Achievements
	{
		id: 12,
		title: 'morningHydratorTitle',
		description: 'morningHydratorDesc',
		icon: 'sunny-outline',
		completed: false,
		points: 60,
		category: 'categoryTime'
	},
	{
		id: 13,
		title: 'nightOwlTitle',
		description: 'nightOwlDesc',
		icon: 'moon-outline',
		completed: false,
		points: 60,
		category: 'categoryTime'
	},
	{
		id: 14,
		title: 'allDayHydratorTitle',
		description: 'allDayHydratorDesc',
		icon: 'time-outline',
		completed: false,
		points: 45,
		category: 'categoryTime'
	},
	// Special Event Achievements
	{
		id: 15,
		title: 'challengeMasterTitle',
		description: 'challengeMasterDesc',
		icon: 'trophy-outline',
		completed: false,
		points: 70,
		category: 'categorySpecial'
	},
	{
		id: 16,
		title: 'holidayHydratorTitle',
		description: 'holidayHydratorDesc',
		icon: 'gift-outline',
		completed: false,
		points: 30,
		category: 'categorySpecial'
	},
	{
		id: 17,
		title: 'seasonalSipperTitle',
		description: 'seasonalSipperDesc',
		icon: 'leaf-outline',
		completed: false,
		points: 200,
		category: 'categorySpecial'
	},
	// Gamified Achievements
	{
		id: 18,
		title: 'badgeCollectorTitle',
		description: 'badgeCollectorDesc',
		icon: 'ribbon-outline',
		completed: false,
		points: 150,
		category: 'categoryGamified'
	},
	{
		id: 19,
		title: 'perfectMonthTitle',
		description: 'perfectMonthDesc',
		icon: 'calendar-outline',
		completed: false,
		points: 300,
		category: 'categoryGamified'
	},
	{
		id: 20,
		title: 'goalSmasherTitle',
		description: 'goalSmasherDesc',
		icon: 'trending-up-outline',
		completed: false,
		points: 100,
		category: 'categoryGamified'
	}
];

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
	const { t } = useLanguage();

	useEffect(() => {
		console.log('Initial achievements on mount:', initialAchievements.map(a => a.title));
		loadAchievements();
	}, []);

	const clearAchievementsStorage = async () => {
		try {
			await AsyncStorage.removeItem('achievements');
			console.log('Cleared achievements storage');
			setAchievements(initialAchievements);
		} catch (error) {
			console.error('Error clearing achievements:', error);
		}
	};

	const loadAchievements = async () => {
		try {
			const savedAchievements = await AsyncStorage.getItem('achievements');
			console.log('Loaded achievements from storage:', savedAchievements);
			if (savedAchievements) {
				try {
					const parsed = JSON.parse(savedAchievements);
					console.log('Parsed achievements:', parsed);
					if (!Array.isArray(parsed) || parsed.length !== initialAchievements.length) {
						console.log('Invalid achievements data, clearing storage');
						await clearAchievementsStorage();
					} else {
						setAchievements(parsed);
					}
				} catch (error) {
					console.error('Error parsing achievements:', error);
					await clearAchievementsStorage();
				}
			} else {
				console.log('No saved achievements found, using initial achievements:', initialAchievements);
				setAchievements(initialAchievements);
			}
		} catch (error) {
			console.error('Error loading achievements:', error);
			await clearAchievementsStorage();
		}
	};

	const saveAchievements = async (newAchievements: Achievement[]) => {
		try {
			console.log('Saving achievements:', newAchievements.map(a => a.title));
			await AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));
		} catch (error) {
			console.error('Error saving achievements:', error);
		}
	};

	const unlockAchievement = (id: number) => {
		console.log('Attempting to unlock achievement:', id);
		const achievement = achievements.find(a => a.id === id);
		if (achievement && !achievement.completed) {
			console.log('Found achievement to unlock:', achievement.title);
			const updatedAchievements = achievements.map(a =>
				a.id === id ? { ...a, completed: true } : a
			);
			console.log('Updated achievements:', updatedAchievements.map(a => `${a.title}: ${a.completed}`));
			setAchievements(updatedAchievements);
			saveAchievements(updatedAchievements);
		} else {
			console.log('Achievement not found or already completed:', id);
		}
	};


	const checkFirstSip = (waterDrank: number) => {
		if (waterDrank > 0) {
			unlockAchievement(1); // First Sip
		}
	};

	const checkDailyGoal = (waterDrank: number, goal: number) => {
		if (waterDrank >= goal) {
			unlockAchievement(2); // Daily Drinker
		}
	};

	const checkStreak = (streak: number) => {
		if (streak >= 3) {
			unlockAchievement(3); // Hydration Starter
		}
		if (streak >= 7) {
			unlockAchievement(4); // Weekly Warrior
		}
		if (streak >= 14) {
			unlockAchievement(5); // Thirst Crusher
		}
		if (streak >= 30) {
			unlockAchievement(6); // Hydration Streaker
		}
	};

	const checkWeekendWarrior = (date: Date) => {
		const day = date.getDay();
		if (day === 0 || day === 6) {
			unlockAchievement(7); // Weekend Winner
		}
	};

	const checkVolumeAchievements = (dailyVolume: number, totalVolume: number) => {
		if (dailyVolume >= 1000) {
			unlockAchievement(8); // 1-Liter Club
		}
		if (totalVolume >= 10000) {
			unlockAchievement(9); // Hydration Hero
		}
		if (totalVolume >= 100000) {
			unlockAchievement(10); // Water Champion
		}
		if (totalVolume >= 1000000) {
			unlockAchievement(11); // Ocean Overlord
		}
	};

	const checkMorningHydrator = (consecutiveDays: number) => {
		if (consecutiveDays >= 7) {
			unlockAchievement(12); // Morning Hydrator
		}
	};

	const checkNightOwl = (consecutiveDays: number) => {
		if (consecutiveDays >= 7) {
			unlockAchievement(13); // Night Owl
		}
	};

	const checkAllDayHydrator = (morningLog: boolean, afternoonLog: boolean, eveningLog: boolean) => {
		if (morningLog && afternoonLog && eveningLog) {
			unlockAchievement(14); // All-Day Hydrator
		}
	};

	const checkHydrationChallenge = (completedDays: number) => {
		if (completedDays >= 7) {
			unlockAchievement(15); // Hydration Challenge Master
		}
	};

	const checkHolidayHydrator = (isHoliday: boolean) => {
		if (isHoliday) {
			unlockAchievement(16); // Holiday Hydrator
		}
	};

	const checkSeasonalSipper = (consecutiveDays: number) => {
		if (consecutiveDays >= 90) { // Approximately one season
			unlockAchievement(17); // Seasonal Sipper
		}
	};

	const checkBadgeCollector = () => {
		const completedCategories = new Set(
			achievements.filter(a => a.completed).map(a => a.category)
		);
		if (completedCategories.size >= 10) {
			unlockAchievement(18); // Badge Collector
		}
	};

	const checkPerfectMonth = (consecutiveDays: number) => {
		if (consecutiveDays >= 30) {
			unlockAchievement(19); // Perfect Month
		}
	};

	const checkGoalSmasher = (exceededDays: number) => {
		if (exceededDays >= 7) {
			unlockAchievement(20); // Goal Smasher
		}
	};

	const resetAchievements = () => {
		const resetAchievements = achievements.map(a => ({ ...a, completed: false }));
		setAchievements(resetAchievements);
		saveAchievements(resetAchievements);
	};

	return (
		<AchievementContext.Provider value={{
			achievements,
			unlockAchievement,
			checkFirstSip,
			checkDailyGoal,
			checkStreak,
			checkWeekendWarrior,
			checkVolumeAchievements,
			checkMorningHydrator,
			checkNightOwl,
			checkAllDayHydrator,
			checkHydrationChallenge,
			checkHolidayHydrator,
			checkSeasonalSipper,
			checkBadgeCollector,
			checkPerfectMonth,
			checkGoalSmasher,
			resetAchievements,
		}}>
			{children}
		</AchievementContext.Provider>
	);
};

export const useAchievements = () => {
	const context = useContext(AchievementContext);
	if (context === undefined) {
		throw new Error('useAchievements must be used within an AchievementProvider');
	}
	return context;
};