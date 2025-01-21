import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { signupStyles } from '../styles/signupStyles';

const SignupScreen = ({ navigation }: any) => {
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const { theme } = useTheme();

	const { registerUser } = useUser();

	const handleSignup = async () => {
		if (!username || !password) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		const result = await registerUser(username, password);
		if (result.success) {
			navigation.reset({
				index: 0,
				routes: [{ name: 'MainApp' }],
			});
		} else {
			Alert.alert('Error', result.message);
		}
	};


	return (
		<View style={[signupStyles.container, { backgroundColor: theme.colors.background }]}>
			<Text style={[signupStyles.title, { color: theme.colors.text }]}>Create Account</Text>
			<TextInput
				style={[signupStyles.input, { 
					borderColor: theme.colors.border,
					color: theme.colors.text,
					backgroundColor: theme.colors.surface
				}]}
				placeholder="Username"
				placeholderTextColor={theme.colors.textSecondary}
				value={username}
				onChangeText={setUsername}
			/>


			<TextInput
				style={[signupStyles.input, { 
					borderColor: theme.colors.border,
					color: theme.colors.text,
					backgroundColor: theme.colors.surface
				}]}
				placeholder="Password"
				placeholderTextColor={theme.colors.textSecondary}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>


			<TouchableOpacity 
				style={[signupStyles.button, { backgroundColor: theme.colors.primary }]} 
				onPress={handleSignup}
			>
				<Text style={signupStyles.buttonText}>Sign Up</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate('Login')}>
				<Text style={[signupStyles.linkText, { color: theme.colors.primary }]}>
					Already have an account? Login
				</Text>
			</TouchableOpacity>
		</View>
	);
};



export default SignupScreen;