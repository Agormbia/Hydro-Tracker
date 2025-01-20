import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { leaderboardStyles } from '../styles/leaderboardStyles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

// Interface for leaderboard item
interface LeaderboardItem {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

// Mock data for the leaderboard
const leaderboardData: LeaderboardItem[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', score: 2500, streak: 7 },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=5', score: 2350, streak: 5 },
  { id: '3', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?img=8', score: 2200, streak: 4 },
  { id: '4', name: 'Alice Brown', avatar: 'https://i.pravatar.cc/150?img=9', score: 2100, streak: 3 },
  { id: '5', name: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?img=3', score: 2000, streak: 2 },
  { id: '6', name: 'Eva Wilson', avatar: 'https://i.pravatar.cc/150?img=10', score: 1950, streak: 1 },
  { id: '7', name: 'Frank Miller', avatar: 'https://i.pravatar.cc/150?img=11', score: 1900, streak: 1 },
  { id: '8', name: 'Grace Lee', avatar: 'https://i.pravatar.cc/150?img=12', score: 1850, streak: 1 },
  { id: '9', name: 'Henry Taylor', avatar: 'https://i.pravatar.cc/150?img=13', score: 1800, streak: 1 },
  { id: '10', name: 'Ivy Clark', avatar: 'https://i.pravatar.cc/150?img=14', score: 1750, streak: 1 },
];

const LeaderboardScreen = ({ navigation }: Props) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const getMedalIcon = (index: number) => {
    if (index === 0) return <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />;
    if (index === 1) return <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />;
    if (index === 2) return <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />;
    return null;
  };

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
    <View style={leaderboardStyles.itemContainer}>
        <View style={leaderboardStyles.rankContainer}>
            <Text style={leaderboardStyles.rank}>{index + 1}</Text>
            {getMedalIcon(index)}
        </View>
        <Image source={{ uri: item.avatar }} style={leaderboardStyles.avatar} />
        <View style={leaderboardStyles.userInfo}>
            <Text style={leaderboardStyles.name}>{item.name}</Text>
            <View style={leaderboardStyles.statsContainer}>
                <Ionicons name="water" size={16} color="#4A90E2" />
                <Text style={leaderboardStyles.score}>{item.score} ml</Text>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={leaderboardStyles.streak}>{item.streak} days</Text>
            </View>
        </View>
    </View>
  );

  return (
    <View style={[leaderboardStyles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={leaderboardStyles.header}>
      <Text style={[leaderboardStyles.title, { color: currentTheme.colors.text }]}>Leaderboard</Text>
        </View>

      <FlatList
        data={leaderboardData}
        renderItem={({ item, index }) => (
            <View style={[leaderboardStyles.itemContainer, { backgroundColor: currentTheme.colors.surface }]}>
            <View style={leaderboardStyles.rankContainer}>
              <Text style={[leaderboardStyles.rank, { color: currentTheme.colors.text }]}>{index + 1}</Text>
              {getMedalIcon(index)}
            </View>
            <Image source={{ uri: item.avatar }} style={leaderboardStyles.avatar} />
            <View style={leaderboardStyles.userInfo}>
              <Text style={[leaderboardStyles.name, { color: currentTheme.colors.text }]}>{item.name}</Text>
              <View style={leaderboardStyles.statsContainer}>
              <Ionicons name="water" size={16} color={currentTheme.colors.primary} />
              <Text style={[leaderboardStyles.score, { color: currentTheme.colors.primary }]}>{item.score} ml</Text>
              <Ionicons name="flame" size={16} color={currentTheme.colors.danger} />
              <Text style={[leaderboardStyles.streak, { color: currentTheme.colors.danger }]}>{item.streak} days</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={leaderboardStyles.listContent}
      />
    </View>
  );
};




export default LeaderboardScreen;

