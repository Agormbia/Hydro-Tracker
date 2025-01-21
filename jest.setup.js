import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
	const Reanimated = require('react-native-reanimated/mock');
	Reanimated.default.call = () => {};
	return Reanimated;
});

jest.mock('expo-notifications', () => ({
	setNotificationHandler: jest.fn(),
	scheduleNotificationAsync: jest.fn(),
	cancelAllScheduledNotificationsAsync: jest.fn(),
	requestPermissionsAsync: jest.fn(),
	AndroidNotificationPriority: {
		HIGH: 'high'
	}
}));

jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

global.window = {};
global.window = global;