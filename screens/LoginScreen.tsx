import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { loginStyles } from '../styles/loginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const { theme } = useTheme();
	const { loginUser } = useUser();

	useEffect(() => {
		loadSavedCredentials();
	}, []);

	const loadSavedCredentials = async () => {
		try {
			const savedUser = await AsyncStorage.getItem('rememberedUser');
			if (savedUser) {
				const { username: savedUsername, password: savedPassword } = JSON.parse(savedUser);
				setUsername(savedUsername);
				setPassword(savedPassword);
				setRememberMe(true);
			}
		} catch (error) {
			console.error('Error loading saved credentials:', error);
		}
	};

	const handleLogin = async () => {
		if (!username || !password) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		const result = await loginUser(username, password);
		if (result.success) {
			if (rememberMe) {
				await AsyncStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
			} else {
				await AsyncStorage.removeItem('rememberedUser');
			}
			navigation.reset({
				index: 0,
				routes: [{ name: 'MainApp' }],
			});
		} else {
			Alert.alert('Error', result.message);
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
			<View style={loginStyles.rememberMeContainer}>
				<TouchableOpacity 
					style={[loginStyles.checkbox, { borderColor: theme.colors.border }]} 
					onPress={() => setRememberMe(!rememberMe)}
				>
					{rememberMe && (
						<Ionicons 
							name="checkmark" 
							size={18} 
							color={theme.colors.primary} 
						/>
					)}
				</TouchableOpacity>
				<Text style={[loginStyles.rememberMeText, { color: theme.colors.text }]}>
					Remember Me
				</Text>
			</View>
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