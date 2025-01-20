import { StyleSheet } from 'react-native';

export const waterIntakeGuideStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 28,
		marginBottom: 20,
		textAlign: 'center',
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 15,
	},
	pickerContainer: {
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 15,
		overflow: 'hidden',
	},
	picker: {
		height: 50,
	},
	button: {
		padding: 15,
		borderRadius: 10,
		marginTop: 10,
		marginBottom: 30,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
	}
});