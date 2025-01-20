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
});