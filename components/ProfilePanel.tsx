import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { useUser } from '../contexts/UserContext';

interface ProfilePanelProps {
	visible: boolean;
	onClose: () => void;
	theme: any;
	onUpdate?: (name: string, avatar: string) => void;
}

const ProfilePanel = ({ visible, onClose, theme, onUpdate }: ProfilePanelProps) => {
	const { dailyData, streak } = useWaterGoal();
	const { currentUser, updateUserAvatar } = useUser();
	const [name, setName] = useState('');
	const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?img=1');

	// Calculate total water intake
	const totalWaterIntake = dailyData.reduce((total, day) => total + day.intake, 0);

	useEffect(() => {
		if (currentUser) {
			setName(currentUser.username);
			setAvatarUrl(currentUser.avatar);
		}
	}, [currentUser]);

	const handleSave = async () => {
		try {
			if (currentUser) {
				await updateUserAvatar(currentUser.username, avatarUrl);
			}
			if (onUpdate) {
				onUpdate(name, avatarUrl);
			}
			onClose();
		} catch (error) {
			console.error('Error saving profile:', error);
		}
	};




	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
				<View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
					<View style={styles.header}>
						<Text style={[styles.title, { color: theme.colors.text }]}>Edit Profile</Text>
						<TouchableOpacity onPress={onClose}>
							<Ionicons name="close" size={24} color={theme.colors.text} />
						</TouchableOpacity>
					</View>

					<View style={styles.avatarContainer}>
						<Image source={{ uri: avatarUrl }} style={styles.avatar} />
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Ionicons name="water" size={24} color={theme.colors.primary} />
								<Text style={[styles.statText, { color: theme.colors.text }]}>
									{totalWaterIntake}ml total
								</Text>
							</View>
							<View style={styles.statItem}>
								<Ionicons name="flame" size={24} color={theme.colors.primary} />
								<Text style={[styles.statText, { color: theme.colors.text }]}>
									{streak} day{streak !== 1 ? 's' : ''}
								</Text>
							</View>
						</View>
						<TouchableOpacity 
							style={[styles.changeButton, { backgroundColor: theme.colors.primary }]}
							onPress={async () => {
								const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
								
								if (status !== 'granted') {
									alert('Sorry, we need camera roll permissions to make this work!');
									return;
								}

								const result = await ImagePicker.launchImageLibraryAsync({
									mediaTypes: ImagePicker.MediaTypeOptions.Images,
									allowsEditing: true,
									aspect: [1, 1],
									quality: 1,
								});

								if (!result.canceled && result.assets[0].uri) {
									setAvatarUrl(result.assets[0].uri);
								}
							}}
						>
							<Text style={styles.buttonText}>Upload Picture</Text>
						</TouchableOpacity>
					</View>

					<Text style={[styles.usernameText, { color: theme.colors.text }]}>{name}</Text>


					<TouchableOpacity 
						style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
						onPress={handleSave}
					>
						<Text style={styles.buttonText}>Save Changes</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginVertical: 10,
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.05)',
		padding: 8,
		borderRadius: 12,
		marginHorizontal: 5,
	},
	statText: {
		marginLeft: 5,
		fontSize: 16,
		fontWeight: '600',
	},
	usernameText: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 20,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	panel: {
		width: '90%',
		borderRadius: 20,
		padding: 20,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	avatarContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: '#E0E0E0', // Light grey border
	},
	changeButton: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderRadius: 20,
	},
	input: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		marginBottom: 20,
	},
	saveButton: {
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: '600',
	},
});

export default ProfilePanel;