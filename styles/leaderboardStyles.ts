import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const leaderboardStyles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 50,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		marginBottom: 20,
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
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 16,
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
	},
	score: {
		fontSize: 14,
		marginRight: 12,
		marginLeft: 4,
	},
	streak: {
		fontSize: 14,
		marginLeft: 4,
	}
});