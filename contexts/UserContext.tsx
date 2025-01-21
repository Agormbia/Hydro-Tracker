import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
	username: string;
	password: string;
	score: number;
	streak: number;
	avatar: string; // URL or base64 string of the avatar image
	achievementsCount: number;
}

interface UserContextType {
	users: User[];
	currentUser: User | null;
	registerUser: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
	loginUser: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
	logoutUser: () => void;
	updateUserScore: (username: string, newScore: number) => void;
	updateUserAvatar: (username: string, avatarData: string) => Promise<void>;
	updateUserAchievements: (username: string, count: number) => Promise<void>;
	resetUserStats: (username: string) => Promise<void>;
	deleteUser: (username: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		try {
			const storedUsers = await AsyncStorage.getItem('users');
			if (storedUsers) {
				setUsers(JSON.parse(storedUsers));
			}
		} catch (error) {
			console.error('Error loading users:', error);
		}
	};

	const saveUsers = async (updatedUsers: User[]) => {
		try {
			await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
			setUsers(updatedUsers);
		} catch (error) {
			console.error('Error saving users:', error);
		}
	};

	const registerUser = async (username: string, password: string) => {
		if (users.some(user => user.username === username)) {
			return { success: false, message: 'Username already exists' };
		}

		const newUser: User = {
			username,
			password,
			score: 0,
			streak: 0,
			avatar: 'https://i.pravatar.cc/150?img=1', // Set default avatar
			achievementsCount: 0
		};

		await saveUsers([...users, newUser]);
		setCurrentUser(newUser); // Set as current user after registration
		return { success: true, message: 'Registration successful' };
	};

	const loginUser = async (username: string, password: string) => {
		const user = users.find(u => u.username === username && u.password === password);
		if (user) {
			// Get the latest user data from the users array
			const currentUserData = users.find(u => u.username === username);
			setCurrentUser(currentUserData || user);
			return { success: true, message: 'Login successful' };
		}
		return { success: false, message: 'Invalid username or password' };
	};

	const logoutUser = () => {
		setCurrentUser(null);
	};

	const updateUserScore = async (username: string, newScore: number) => {
		try {
			const updatedUsers = users.map(user => 
				user.username === username ? { ...user, score: newScore } : user
			);
			await saveUsers(updatedUsers);
			
			// Update currentUser if it's the same user
			if (currentUser?.username === username) {
				setCurrentUser({ ...currentUser, score: newScore });
			}
		} catch (error) {
			console.error('Error updating user score:', error);
			throw error;
		}
	};

	const updateUserAvatar = async (username: string, avatarData: string) => {
		// Update users array
		const updatedUsers = users.map(user => 
			user.username === username ? { ...user, avatar: avatarData } : user
		);
		
		// Save to AsyncStorage first
		await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
		
		// Update state after successful save
		setUsers(updatedUsers);
		
		// Update currentUser if it's the same user
		if (currentUser?.username === username) {
			setCurrentUser({ ...currentUser, avatar: avatarData });
		}
	};

	const updateUserAchievements = async (username: string, count: number) => {
		const updatedUsers = users.map(user => 
			user.username === username ? { ...user, achievementsCount: count } : user
		);
		await saveUsers(updatedUsers);
		if (currentUser?.username === username) {
			setCurrentUser({ ...currentUser, achievementsCount: count });
		}
	};

	const resetUserStats = async (username: string) => {
		try {
			const updatedUsers = users.map(user => 
				user.username === username ? {
					...user,
					score: 0,
					streak: 0,
					// Keep achievementsCount unchanged
				} : user
			);
			await saveUsers(updatedUsers);
			if (currentUser?.username === username) {
				setCurrentUser({ 
					...currentUser, 
					score: 0, 
					streak: 0,
					// Keep achievementsCount unchanged
				});
			}
		} catch (error) {
			console.error('Error resetting user stats:', error);
		}
	};

	const deleteUser = async (username: string) => {
		try {
			const updatedUsers = users.filter(user => user.username !== username);
			await saveUsers(updatedUsers);
			if (currentUser?.username === username) {
				setCurrentUser(null);
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			throw error;
		}
	};

	return (
		<UserContext.Provider value={{ 
			users, 
			currentUser, 
			registerUser, 
			loginUser, 
			logoutUser,
			updateUserScore,
			updateUserAvatar,
			updateUserAchievements,
			resetUserStats,
			deleteUser
		}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};