import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SchedulableTriggerInputTypes, DailyTriggerInput, CalendarTriggerInput } from 'expo-notifications';

export class NotificationService {
	static async requestPermissions() {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		console.log('Notification permission status:', finalStatus);
		return finalStatus === 'granted';
	}

	static async scheduleHydrationReminders(frequency: number) {
		console.log('Scheduling hydration reminders with frequency:', frequency);
		await Notifications.cancelAllScheduledNotificationsAsync();

		const startHour = 8;
		const endHour = 20;

		const messages = [
			{ title: "Time to Hydrate! 💧", body: "Don't forget to drink water and track your intake!" },
			{ title: "Stay Hydrated! 🌊", body: "A glass of water keeps you healthy and energized!" },
			{ title: "Water Break! 💦", body: "Take a moment to hydrate yourself!" },
			{ title: "Hydration Check ✨", body: "Have you had your water for this hour?" }
		];

		for (let hour = startHour; hour <= endHour; hour += frequency) {
			const messageIndex = Math.floor(Math.random() * messages.length);
			console.log(`Scheduling notification for ${hour}:00`);

			try {
				const identifier = await Notifications.scheduleNotificationAsync({
					content: {
						title: messages[messageIndex].title,
						body: messages[messageIndex].body,
						sound: true,
						priority: Notifications.AndroidNotificationPriority.HIGH,
					},
					trigger: Platform.OS === 'ios' 
						? {
							type: SchedulableTriggerInputTypes.CALENDAR,
							repeats: true,
							hour: hour,
							minute: 0
						}
						: {
							type: SchedulableTriggerInputTypes.DAILY,
							hour: hour,
							minute: 0
						},
				});
				console.log(`Scheduled notification with ID: ${identifier} for ${hour}:00`);
			} catch (error) {
				console.error(`Error scheduling notification for ${hour}:00:`, error);
			}
		}

		// Verify scheduled notifications
		const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
		console.log('Currently scheduled notifications:', scheduledNotifications);
	}

	static async scheduleGoalReminder() {
		try {
			const identifier = await Notifications.scheduleNotificationAsync({
				content: {
					title: "Daily Hydration Goal Check 🎯",
					body: "Have you reached your water intake goal today?",
					sound: true,
					priority: Notifications.AndroidNotificationPriority.HIGH,
				},
				trigger: Platform.OS === 'ios'
					? {
						type: SchedulableTriggerInputTypes.CALENDAR,
						repeats: true,
						hour: 20,
						minute: 0
					}
					: {
						type: SchedulableTriggerInputTypes.DAILY,
						hour: 20,
						minute: 0
					},
			});
			console.log('Scheduled goal reminder with ID:', identifier);
			return identifier;
		} catch (error) {
			console.error('Error scheduling goal reminder:', error);
			throw error;
		}
	}

	static async getScheduledNotifications() {
		const notifications = await Notifications.getAllScheduledNotificationsAsync();
		console.log('All scheduled notifications:', notifications);
		return notifications;
	}

	static async cancelAllReminders() {
		await Notifications.cancelAllScheduledNotificationsAsync();
		console.log('All notifications cancelled');
	}
}