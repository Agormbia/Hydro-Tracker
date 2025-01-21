import { NotificationService } from './services/NotificationService';

async function testNotification() {
	// Request notification permissions
	const hasPermission = await NotificationService.requestPermissions();
	if (!hasPermission) {
		console.log('No notification permission granted');
		return;
	}

	// Schedule an immediate water reminder
	await NotificationService.scheduleHydrationReminders(2); // Send reminders every 2 hours
	console.log('Notification scheduled successfully');
}

testNotification().catch(console.error);