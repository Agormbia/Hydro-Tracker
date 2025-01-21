import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const leaderboardStyles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 50,
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	emptyText: {
		fontSize: 16,
		textAlign: 'center',
		opacity: 0.7,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	listContent: {
		paddingHorizontal: 16,
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 12,
		marginBottom: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	rankContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		minWidth: 60,
	},
	rank: {
		fontSize: 18,
		fontWeight: 'bold',
		marginRight: 8,
		minWidth: 24,
	},
	avatarContainer: {
		marginRight: 12,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		borderWidth: 2,
		borderColor: '#E0E0E0',
	},

	placeholderAvatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		borderWidth: 2,
		borderColor: '#E0E0E0', // Light grey border
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeholderText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	userInfo: {
		flex: 1,
	},
	name: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	statsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	stat: {
		fontSize: 14,
		fontWeight: '500',
	},

	sortContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	sortButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	sortButtonText: {
		fontSize: 14,
		fontWeight: '600',
	},
});

