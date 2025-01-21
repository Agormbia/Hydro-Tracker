import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { leaderboardStyles } from '../styles/leaderboardStyles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { lightTheme, darkTheme } from '../styles/theme';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

type SortType = 'water' | 'streak' | 'achievements';

interface User {
  username: string;
  score: number;
  streak: number;
  avatar: string;
  achievementsCount: number;
}

const LeaderboardScreen = ({ navigation }: Props) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const { users, currentUser } = useUser();
  const { t } = useLanguage();
  const { streak, todayIntake } = useWaterGoal();

  const [sortBy, setSortBy] = useState<SortType>('water');
  const [localUsers, setLocalUsers] = useState(users);

  useEffect(() => {
    // Update local users when users or todayIntake changes
    setLocalUsers(users);
  }, [users, todayIntake]);

  const sortedUsers = [...localUsers].map(user => ({
    ...user,
    streak: user.username === currentUser?.username ? streak : user.streak
  })).sort((a, b) => {
    switch (sortBy) {
      case 'water':
        return b.score - a.score;
      case 'streak':
        return b.streak - a.streak;
      case 'achievements':
        return b.achievementsCount - a.achievementsCount;
      default:
        return 0;
    }
  });

  const getMedalIcon = (index: number) => {
    if (index === 0) return <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />;
    if (index === 1) return <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />;
    if (index === 2) return <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />;
    return null;
  };

  return (
    <View style={[leaderboardStyles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={leaderboardStyles.header}>
        <Text style={[leaderboardStyles.title, { color: currentTheme.colors.text }]}>{t('leaderboard')}</Text>
      </View>

      <View style={leaderboardStyles.sortContainer}>
        <TouchableOpacity 
          style={[
            leaderboardStyles.sortButton, 
            sortBy === 'water' && { backgroundColor: currentTheme.colors.primary }
          ]}
          onPress={() => setSortBy('water')}
        >
          <Text style={[leaderboardStyles.sortButtonText, { color: sortBy === 'water' ? '#fff' : currentTheme.colors.text }]}>
            Water
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            leaderboardStyles.sortButton, 
            sortBy === 'streak' && { backgroundColor: currentTheme.colors.primary }
          ]}
          onPress={() => setSortBy('streak')}
        >
          <Text style={[leaderboardStyles.sortButtonText, { color: sortBy === 'streak' ? '#fff' : currentTheme.colors.text }]}>
            Streak
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            leaderboardStyles.sortButton, 
            sortBy === 'achievements' && { backgroundColor: currentTheme.colors.primary }
          ]}
          onPress={() => setSortBy('achievements')}
        >
          <Text style={[leaderboardStyles.sortButtonText, { color: sortBy === 'achievements' ? '#fff' : currentTheme.colors.text }]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {sortedUsers.length === 0 ? (
        <View style={leaderboardStyles.emptyState}>
          <Text style={[leaderboardStyles.emptyText, { color: currentTheme.colors.text }]}>
            No users have registered yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedUsers}
          renderItem={({ item, index }) => (
            <View style={[leaderboardStyles.itemContainer, { backgroundColor: currentTheme.colors.surface }]}>
              <View style={leaderboardStyles.rankContainer}>
                <Text style={[leaderboardStyles.rank, { color: currentTheme.colors.text }]}>{index + 1}</Text>
                {getMedalIcon(index)}
              </View>
              <View style={leaderboardStyles.avatarContainer}>
                <Image 
                  source={{ uri: item.avatar || 'https://i.pravatar.cc/150?img=1' }}
                  style={leaderboardStyles.avatar}
                />
              </View>
              <View style={leaderboardStyles.userInfo}>
                <Text style={[leaderboardStyles.name, { color: currentTheme.colors.text }]}>{item.username}</Text>
                <View style={leaderboardStyles.statsContainer}>
                  <View style={leaderboardStyles.statItem}>
                    <Ionicons name="water" size={16} color={currentTheme.colors.primary} />
                    <Text style={[leaderboardStyles.stat, { color: currentTheme.colors.primary }]}>
                      {item.score}ml
                    </Text>
                  </View>
                  <View style={leaderboardStyles.statItem}>
                    <Ionicons name="flame" size={16} color={currentTheme.colors.danger} />
                    <Text style={[leaderboardStyles.stat, { color: currentTheme.colors.danger }]}>
                      {item.streak} days
                    </Text>
                  </View>
                  <View style={leaderboardStyles.statItem}>
                    <Ionicons name="trophy" size={16} color={currentTheme.colors.warning} />
                    <Text style={[leaderboardStyles.stat, { color: currentTheme.colors.warning }]}>
                      {item.achievementsCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.username}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={leaderboardStyles.listContent}
        />
      )}
    </View>
  );
};

export default LeaderboardScreen;


