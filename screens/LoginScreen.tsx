import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { loginStyles } from '../styles/loginStyles';

const LoginScreen = ({ navigation }: any) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { theme } = useTheme();

	const handleLogin = async () => {
		try {
			navigation.navigate('MainApp');
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	return (
		<View style={[loginStyles.container, { backgroundColor: theme.colors.background }]}>
			<Text style={[loginStyles.title, { color: theme.colors.text }]}>Hydro Tracker</Text>
			<TextInput
				style={[loginStyles.input, { 
					borderColor: theme.colors.border,
					color: theme.colors.text,
					backgroundColor: theme.colors.surface
				}]}
				placeholder="Username"
				placeholderTextColor={theme.colors.textSecondary}
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
			/>
			<TextInput
				style={[loginStyles.input, { 
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
				style={[loginStyles.button, { backgroundColor: theme.colors.primary }]} 
				onPress={handleLogin}
			>
				<Text style={loginStyles.buttonText}>Login</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
				<Text style={[loginStyles.linkText, { color: theme.colors.primary }]}>
					Don't have an account? Sign up
				</Text>
			</TouchableOpacity>
		</View>
	);
};




export default LoginScreen;