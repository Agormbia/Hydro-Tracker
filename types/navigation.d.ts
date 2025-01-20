import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

declare global {
	type RootStackParamList = {
		MainApp: undefined;
	};

	type TabParamList = {
		home: undefined;
		statistics: undefined;
		achievementsTitle: undefined;
		settings: undefined;
		waterIntakeGuide: undefined;
		leaderboard: undefined;
	};

	type TabScreenProps = BottomTabScreenProps<TabParamList>;
}

export {};