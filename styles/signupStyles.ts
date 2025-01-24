import { StyleSheet } from 'react-native';

export const signupStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 40,
	},
	input: {
		borderWidth: 1,
		padding: 15,
		marginBottom: 15,
		borderRadius: 5,
	},
	button: {
		padding: 15,
		borderRadius: 5,
		marginBottom: 15,
	},
	buttonText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
	},
	linkText: {
		textAlign: 'center',
	},
	rememberMeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		width: '100%',
		paddingHorizontal: 20,
	},
	rememberMeText: {
		marginLeft: 8,
		fontSize: 16,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderRadius: 4,
		marginRight: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		position: 'relative',
	},
	eyeIcon: {
		position: 'absolute',
		right: 15,
		height: '100%',
		justifyContent: 'center',
	},
});