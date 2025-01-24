import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { signupStyles } from '../styles/signupStyles';

const SignupScreen = ({ navigation }: any) => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [username, setUsername] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { theme } = useTheme();
	const { registerUser } = useUser();

	const handleSignup = async () => {
		if (!username || !password || !confirmPassword) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');
			return;
		}

		const result = await registerUser(username, password);
		if (result.success) {
			Alert.alert('Success', 'Account created successfully', [
				{ text: 'OK', onPress: () => navigation.navigate('Login') }
			]);
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

			<View style={signupStyles.passwordContainer}>
				<TextInput
					style={[signupStyles.input, { 
						borderColor: theme.colors.border,
						color: theme.colors.text,
						backgroundColor: theme.colors.surface,
						flex: 1
					}]}
					placeholder="Password"
					placeholderTextColor={theme.colors.textSecondary}
					value={password}
					onChangeText={setPassword}
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity 
					style={signupStyles.eyeIcon} 
					onPress={() => setShowPassword(!showPassword)}
				>
					<Ionicons 
						name={showPassword ? "eye-off" : "eye"} 
						size={24} 
						color={theme.colors.text} 
					/>
				</TouchableOpacity>
			</View>

			<View style={signupStyles.passwordContainer}>
				<TextInput
					style={[signupStyles.input, { 
						borderColor: theme.colors.border,
						color: theme.colors.text,
						backgroundColor: theme.colors.surface,
						flex: 1
					}]}
					placeholder="Confirm Password"
					placeholderTextColor={theme.colors.textSecondary}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry={!showConfirmPassword}
				/>
				<TouchableOpacity 
					style={signupStyles.eyeIcon} 
					onPress={() => setShowConfirmPassword(!showConfirmPassword)}
				>
					<Ionicons 
						name={showConfirmPassword ? "eye-off" : "eye"} 
						size={24} 
						color={theme.colors.text} 
					/>
				</TouchableOpacity>
			</View>

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