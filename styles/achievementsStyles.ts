import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BADGE_SIZE = (width - 60) / 2;

export const achievementsStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	totalPoints: {
		alignItems: 'center',
		marginBottom: 20,
		padding: 10,
	},
	totalPointsText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	categoryHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 5,
		marginTop: 10,
		marginBottom: 15,
	},
	categoryProgress: {
		fontSize: 16,
		fontWeight: '500',
	},
	categoryTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 15,
		paddingHorizontal: 5,
	},
	badgeContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	badge: {
		width: BADGE_SIZE,
		padding: 15,
		borderRadius: 15,
		marginBottom: 20,
		borderWidth: 2,
		alignItems: 'center',
	},
	badgeTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 5,
		textAlign: 'center',
	},
	badgeDescription: {
		fontSize: 12,
		textAlign: 'center',
		marginBottom: 10,
	},
	badgeFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 'auto',
	},
	points: {
		fontSize: 14,
		fontWeight: 'bold',
		marginRight: 5,
	}
});