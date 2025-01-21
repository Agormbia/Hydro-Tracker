import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const AvatarCustomization = () => {
	const { currentUser, updateUserAvatar } = useUser();
	const { theme } = useTheme();
	const [loading, setLoading] = useState(false);

	const pickImage = async () => {
		try {
			setLoading(true);
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.5,
				base64: true,
			});

			if (!result.canceled && result.assets[0].base64) {
				const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
				await updateUserAvatar(currentUser!.username, base64Image);
			}
		} catch (error) {
			console.error('Error picking image:', error);
		} finally {
			setLoading(false);
		}
	};

	if (!currentUser) return null;

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
			<Text style={[styles.username, { color: theme.colors.text }]}>
				{currentUser.username}'s Avatar
			</Text>
			<TouchableOpacity onPress={pickImage} disabled={loading}>
				<View style={styles.avatarContainer}>
					{currentUser.avatar ? (
						<Image
							source={{ uri: currentUser.avatar }}
							style={styles.avatar}
						/>
					) : (
						<View style={[styles.placeholderAvatar, { backgroundColor: theme.colors.primary }]}>
							<Text style={styles.placeholderText}>
								{currentUser.username.charAt(0).toUpperCase()}
							</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
			<Text style={[styles.totalWater, { color: theme.colors.text }]}>
				Total Water: {currentUser.score}ml
			</Text>
			<TouchableOpacity 
				style={[styles.button, { backgroundColor: theme.colors.primary }]}
				onPress={pickImage}
				disabled={loading}
			>
				<Text style={styles.buttonText}>
					{loading ? 'Loading...' : 'Change Avatar'}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		alignItems: 'center',
		marginVertical: 16,
		width: '100%',
	},
	username: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
		width: '100%',
	},
	avatarContainer: {
		width: 150,
		height: 150,
		borderRadius: 75,
		overflow: 'hidden',
		marginBottom: 20,
	},
	avatar: {
		width: '100%',
		height: '100%',
	},
	placeholderAvatar: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeholderText: {
		fontSize: 48,
		color: 'white',
	},
	button: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	totalWater: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '500',
	},
});

export default AvatarCustomization;
