import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
	id: string;
	name: string;
	intake: number;
	streak: number;
	rank: number;
	avatar?: string;
	badges: string[];
	isAnonymous?: boolean;
}

interface LeaderboardContextType {
	users: User[];
	period: 'daily' | 'weekly' | 'monthly';
	setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
	refreshLeaderboard: () => void;
	sendEncouragement: (userId: string) => void;
	toggleAnonymousMode: (anonymous: boolean) => void;
	challengeUser: (userId: string) => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const useLeaderboard = () => {
	const context = useContext(LeaderboardContext);
	if (!context) {
		throw new Error('useLeaderboard must be used within a LeaderboardProvider');
	}
	return context;
};

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

	// Mock data - replace with real API calls in production
	const mockUsers: User[] = [
		{ id: '1', name: 'John Doe', intake: 3200, streak: 7, rank: 1, badges: ['streak-master', 'early-bird'] },
		{ id: '2', name: 'Jane Smith', intake: 2800, streak: 5, rank: 2, badges: ['consistent'] },
		{ id: '3', name: 'Mike Johnson', intake: 2600, streak: 3, rank: 3, badges: ['newcomer'] },
	];

	useEffect(() => {
		// Simulate API call
		setUsers(mockUsers);
	}, [period]);

	const refreshLeaderboard = () => {
		// Simulate API refresh
		setUsers([...mockUsers].sort((a, b) => b.intake - a.intake));
	};

	const sendEncouragement = (userId: string) => {
		// Implement encouragement functionality
		console.log(`Sending encouragement to user ${userId}`);
	};

	const toggleAnonymousMode = (anonymous: boolean) => {
		// Implement anonymous mode
		console.log(`Setting anonymous mode to ${anonymous}`);
	};

	const challengeUser = (userId: string) => {
		// Implement challenge functionality
		console.log(`Challenging user ${userId}`);
	};

	const value = {
		users,
		period,
		setPeriod,
		refreshLeaderboard,
		sendEncouragement,
		toggleAnonymousMode,
		challengeUser,
	};

	return (
		<LeaderboardContext.Provider value={value}>
			{children}
		</LeaderboardContext.Provider>
	);
};