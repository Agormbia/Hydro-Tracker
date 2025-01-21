import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';

interface WaterLog {
	time: string;
	amount: number;
}

interface DailyData {
	date: string;
	intake: number;
	goal: number;
	timeLog: WaterLog[];
}

const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
};

interface WaterGoalContextType {

	dailyGoal: number;
	todayIntake: number;
	dailyData: DailyData[];
	streak: number;
	bestStreak: number;
	updateDailyGoal: (goal: number) => Promise<void>;
	logWaterIntake: (amount: number) => Promise<void>;
	getDailyData: () => DailyData[];
	resetProgress: () => Promise<void>;
	resetDailyGoal: () => Promise<void>;
	changeDate: (newDate: string) => Promise<void>;
}

const WaterGoalContext = createContext<WaterGoalContextType | undefined>(undefined);

export const WaterGoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { currentUser, updateUserScore } = useUser();
	const [dailyGoal, setDailyGoal] = useState(2000);
	const [todayIntake, setTodayIntake] = useState(0);
	const [dailyData, setDailyData] = useState<DailyData[]>([]);
	const [streak, setStreak] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);

	const getStorageKeys = () => {
		const baseKey = currentUser ? `${currentUser.username}_` : '';
		return {
			dailyGoal: `${baseKey}dailyWaterGoal`,
			dailyData: `${baseKey}dailyData`,
			streak: `${baseKey}streak`,
			bestStreak: `${baseKey}bestStreak`
		};
	};

	const checkDateChange = async (currentData: DailyData[], currentStreak: number, currentGoal: number) => {
		const today = new Date().toISOString().split('T')[0];
		const lastEntry = currentData[currentData.length - 1];
		const keys = getStorageKeys();
		
		if (!lastEntry || lastEntry.date !== today) {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			const yesterdayStr = yesterday.toISOString().split('T')[0];
			
			const yesterdayData = currentData.find(d => d.date === yesterdayStr);
			let newStreak = currentStreak;
			
			if (!yesterdayData || yesterdayData.intake < yesterdayData.goal) {
				newStreak = 0;
			}
			
			const newDayData = {
				date: today,
				intake: 0,
				goal: currentGoal,
				timeLog: []
			};
			
			const updatedData = [...currentData, newDayData];
			await AsyncStorage.setItem(keys.dailyData, JSON.stringify(updatedData));
			await AsyncStorage.setItem(keys.streak, newStreak.toString());
			
			return {
				updatedData,
				newStreak,
				resetIntake: true
			};
		}
		
		return {
			updatedData: currentData,
			newStreak: currentStreak,
			resetIntake: false
		};
	};

	useEffect(() => {
		loadData();
	}, [currentUser]);

	useEffect(() => {
		const scheduleNextDayCheck = () => {
			const msUntilMidnight = getMillisecondsUntilMidnight();
			
			return setTimeout(async () => {
				const result = await checkDateChange(dailyData, streak, dailyGoal);
				if (result.resetIntake) {
					setDailyData(result.updatedData);
					setStreak(result.newStreak);
					setTodayIntake(0);
				}
				// Schedule the next check
				scheduleNextDayCheck();
			}, msUntilMidnight);
		};

		// Check immediately when mounted
		const checkNow = async () => {
			const result = await checkDateChange(dailyData, streak, dailyGoal);
			if (result.resetIntake) {
				setDailyData(result.updatedData);
				setStreak(result.newStreak);
				setTodayIntake(0);
			}
		};
		checkNow();

		// Schedule next check
		const timeoutId = scheduleNextDayCheck();

		return () => clearTimeout(timeoutId);
	}, [dailyData, streak, dailyGoal]);



	const loadData = async () => {

		try {
			const keys = getStorageKeys();
			const storedGoal = await AsyncStorage.getItem(keys.dailyGoal);
			const storedData = await AsyncStorage.getItem(keys.dailyData);
			const storedStreak = await AsyncStorage.getItem(keys.streak);
			const storedBestStreak = await AsyncStorage.getItem(keys.bestStreak);
			
			if (storedGoal) {
				setDailyGoal(parseInt(storedGoal));
			}
			
			if (storedData) {
				const data: DailyData[] = JSON.parse(storedData);
				setDailyData(data);
				
				// Set today's intake
				const today = new Date().toISOString().split('T')[0];
				const todayData = data.find(d => d.date === today);
				if (todayData) {
					setTodayIntake(todayData.intake);
				}
			}

			if (storedStreak) {
				setStreak(parseInt(storedStreak));
			}

			if (storedBestStreak) {
				setBestStreak(parseInt(storedBestStreak));
			}
		} catch (error) {
			console.error('Error loading data:', error);
		}
	};

	const updateDailyGoal = async (goal: number) => {
		try {
			const keys = getStorageKeys();
			await AsyncStorage.setItem(keys.dailyGoal, goal.toString());
			setDailyGoal(goal);
			
			// Update today's goal in daily data
			const today = new Date().toISOString().split('T')[0];
			const updatedData = dailyData.map(day => 
				day.date === today ? { ...day, goal } : day
			);
			await AsyncStorage.setItem(keys.dailyData, JSON.stringify(updatedData));
			setDailyData(updatedData);
		} catch (error) {
			console.error('Error saving daily goal:', error);
			throw error;
		}
	};

	const resetProgress = async () => {
		try {
			const keys = getStorageKeys();
			// Remove all data except daily goal
			const keysToRemove = [
				keys.streak,
				keys.bestStreak,
				keys.dailyData
			];
			await AsyncStorage.multiRemove(keysToRemove);

			// Reset all state
			setStreak(0);
			setBestStreak(0);
			
			// Create a fresh start with only today's entry
			const today = new Date().toISOString().split('T')[0];
			const newDayData = {
				date: today,
				intake: 0,
				goal: dailyGoal,
				timeLog: []
			};

			const freshData = [newDayData];
			await AsyncStorage.setItem(keys.dailyData, JSON.stringify(freshData));
			
			// Update state
			setDailyData(freshData);
			setTodayIntake(0);

			// Reset user's total score if user is logged in
			if (currentUser) {
				await updateUserScore(currentUser.username, 0);
			}

		} catch (error) {
			console.error('Error resetting progress:', error);
			throw error;
		}
	};



	const logWaterIntake = async (amount: number) => {
		try {
			const today = new Date().toISOString().split('T')[0];
			const currentTime = new Date().toLocaleTimeString();
			const newLog: WaterLog = { time: currentTime, amount };
			const keys = getStorageKeys();
			
			let updatedData = [...dailyData];
			const todayIndex = updatedData.findIndex(d => d.date === today);
			const newIntake = todayIntake + amount;
			
			if (todayIndex >= 0) {
				updatedData[todayIndex] = {
					...updatedData[todayIndex],
					intake: newIntake,
					timeLog: [...updatedData[todayIndex].timeLog, newLog]
				};
			} else {
				updatedData.push({
					date: today,
					intake: amount,
					goal: dailyGoal,
					timeLog: [newLog]
				});
			}
			
			// Only increment streak when completing daily goal for the first time today
			if (newIntake >= dailyGoal && todayIntake < dailyGoal) {
				const newStreak = streak === 0 ? 1 : streak + 1;
				setStreak(newStreak);
				await AsyncStorage.setItem(keys.streak, newStreak.toString());
				
				if (newStreak > bestStreak) {
					setBestStreak(newStreak);
					await AsyncStorage.setItem(keys.bestStreak, newStreak.toString());
				}
			}
			
			// Calculate total water intake from all time
			if (currentUser) {
				// Calculate total from all historical data including today's new amount
				const totalIntake = updatedData.reduce((sum, day) => sum + day.intake, 0);
				// Update the user's total score with the complete total
				updateUserScore(currentUser.username, totalIntake);
			}

			await AsyncStorage.setItem(keys.dailyData, JSON.stringify(updatedData));
			setDailyData(updatedData);
			setTodayIntake(newIntake);
		} catch (error) {
			console.error('Error logging water intake:', error);
			throw error;
		}
	};



	const getDailyData = () => dailyData;

	const resetDailyGoal = async () => {
		try {
			// Reset to default goal
			setDailyGoal(2000);
			const keys = getStorageKeys();
			await AsyncStorage.setItem(keys.dailyGoal, '2000');
		} catch (error) {
			console.error('Error resetting daily goal:', error);
			throw error;
		}
	};

	const changeDate = async (newDate: string) => {
		try {
			// Check if we already have data for this date
			const dateData = dailyData.find(d => d.date === newDate);
			if (dateData) {
				setTodayIntake(dateData.intake);
			} else {
				// Create new entry for the date
				const newDayData = {
					date: newDate,
					intake: 0,
					goal: dailyGoal,
					timeLog: []
				};
				const updatedData = [...dailyData, newDayData];
				const keys = getStorageKeys();
				await AsyncStorage.setItem(keys.dailyData, JSON.stringify(updatedData));
				setDailyData(updatedData);
				setTodayIntake(0);
			}
		} catch (error) {
			console.error('Error changing date:', error);
			throw error;
		}
	};

	return (
		<WaterGoalContext.Provider value={{ 
			dailyGoal, 
			todayIntake, 
			dailyData,
			streak,
			bestStreak,
			updateDailyGoal, 
			logWaterIntake,
			getDailyData,
			resetProgress,
			resetDailyGoal,
			changeDate
		}}>
			{children}
		</WaterGoalContext.Provider>
	);
};

export const useWaterGoal = () => {
	const context = useContext(WaterGoalContext);
	if (context === undefined) {
		throw new Error('useWaterGoal must be used within a WaterGoalProvider');
	}
	return context;
};