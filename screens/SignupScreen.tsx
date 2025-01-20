import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { signupStyles } from '../styles/signupStyles';

const SignupScreen = ({ navigation }: any) => {
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const { theme } = useTheme();


	const handleSignup = async () => {
		try {
			navigation.navigate('MainApp');
		} catch (error) {
			console.error('Signup error:', error);
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