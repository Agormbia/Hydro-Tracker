import { StyleSheet } from 'react-native';

export const statisticsStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	statCard: {
		width: '48%',
		padding: 15,
		borderRadius: 12,
		marginBottom: 15,
	},
	statTitle: {
		fontSize: 14,
		marginBottom: 5,
	},
	statValue: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	section: {
		padding: 15,
		borderRadius: 15,
		marginBottom: 20,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
	periodToggle: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 15,
	},
	periodButton: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		marginHorizontal: 5,
		borderRadius: 20,
		borderWidth: 1,
	},
	periodButtonActive: {
		backgroundColor: '#007AFF',
	},
	periodButtonText: {
		fontSize: 14,
	},
	dayContainer: {
		marginBottom: 15,
	},
	dayText: {
		fontSize: 14,
		marginBottom: 5,
	},
	progressBarContainer: {
		marginTop: 5,
	},
	progressBar: {
		height: 10,
		borderRadius: 5,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
	},
	progressText: {
		fontSize: 12,
		marginTop: 5,
	},
	dayHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},
	percentageText: {
		fontSize: 14,
		fontWeight: '600',
	},
	resetButton: {
		marginTop: 20,
		marginBottom: 40,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		backgroundColor: '#FF3B30',
	},
	resetButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	}
});