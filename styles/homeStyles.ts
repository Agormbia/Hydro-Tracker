import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		backgroundColor: 'transparent',
	} as ViewStyle,

	achievementBadge: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1000,
		elevation: 1000,
		paddingTop: 0, // Remove top padding since we handle it in the badge component
	} as ViewStyle,

	contentContainer: {
		flexGrow: 1,
	},

	innerContainer: {
		padding: 16,
		paddingBottom: 40,
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 30,
		paddingHorizontal: 16,
	} as ViewStyle,

	profileImage: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: '#E0E0E0', // Light grey border
	} as ImageStyle,

	iconButton: {
		padding: 8,
	} as ViewStyle,

	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	} as TextStyle,

	progressContainer: {
		alignItems: 'center',
		marginBottom: 40,
	},

	optionsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: -8,
	} as ViewStyle,

	optionButton: {
		width: '50%',
		padding: 8,
		alignItems: 'center',
		justifyContent: 'center',
	} as ViewStyle,

	optionButtonInner: {
		width: '100%',
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	} as ViewStyle,

	optionText: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 8,
	} as TextStyle,

	optionAmount: {
		fontSize: 14,
		marginTop: 4,
	} as TextStyle,

	resetButton: {
		flex: 1,
		marginLeft: 10,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	} as ViewStyle,

	resetButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	} as TextStyle,

	completionText: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '600',
		marginTop: 20,
		marginHorizontal: 20,
	} as TextStyle,

	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 20,
		marginTop: 10,
	} as ViewStyle,

	updateButton: {
		flex: 1,
		marginRight: 10,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	} as ViewStyle,

	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	} as TextStyle,

	goalInputContainer: {
		marginHorizontal: 20,
		marginTop: 10,
	} as ViewStyle,

	goalInput: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 15,
		fontSize: 16,
		marginBottom: 10,
	} as TextStyle
});