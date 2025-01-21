import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


type TabParamList = {
  home: undefined;
  statistics: undefined;
  leaderboard: undefined;
  achievementsTitle: undefined;
  waterIntakeGuide: undefined;
  settings: undefined;
};


type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Components

import SplashScreen from './components/SplashScreen';

// Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AchievementProvider } from './contexts/AchievementContext';
import { WaterGoalProvider } from './contexts/WaterGoalContext';

import { LeaderboardProvider } from './contexts/LeaderboardContext';
import { UserProvider } from './contexts/UserContext';

// Themes
import { lightTheme, darkTheme } from './styles/theme';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import WaterIntakeGuideScreen from './screens/WaterIntakeGuideScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';




const AppTabs: React.FC = () => {

  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (

    <Tab.Navigator
        screenOptions={({ route }: { route: { name: keyof TabParamList } }) => ({
      tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
        case 'home':
          iconName = focused ? 'water' : 'water-outline';
          break;
        case 'statistics':
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          break;
        case 'achievementsTitle':
          iconName = focused ? 'trophy' : 'trophy-outline';
          break;
        case 'settings':
          iconName = focused ? 'settings' : 'settings-outline';
          break;
        case 'waterIntakeGuide':
          iconName = focused ? 'information-circle' : 'information-circle-outline';
          break;
        case 'leaderboard':
          iconName = focused ? 'podium' : 'podium-outline';
          break;
        default:
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={focused ? size * 1.2 : size} color={color} />;
      },
      tabBarActiveTintColor: currentTheme.colors.primary,
      tabBarInactiveTintColor: currentTheme.colors.textSecondary,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: currentTheme.colors.surface,
        borderTopColor: currentTheme.colors.border,
        height: 60,
      },
        tabBarLabelStyle: {
        fontSize: 12,
        paddingBottom: 5
        },
        headerTitleStyle: {
        fontSize: 18,
        color: currentTheme.colors.text,
        },
        headerStyle: {
        backgroundColor: currentTheme.colors.surface,
        borderBottomColor: currentTheme.colors.border,
        borderBottomWidth: 1,
        },
        tabBarItemStyle: {
        padding: 5,
        },
        tabBarIconStyle: {
        marginTop: 5
        }
        })}





    >
        <Tab.Screen 
          name="home" 
          component={HomeScreen} 
          options={{ title: t('home') }} 
        />
        <Tab.Screen 
          name="statistics" 
          component={StatisticsScreen} 
          options={{ title: t('statistics') }} 
        />
        <Tab.Screen 
          name="leaderboard" 
          component={LeaderboardScreen} 
          options={{ title: t('leaderboard') }} 
        />
        <Tab.Screen 
          name="achievementsTitle" 
          component={AchievementsScreen} 
          options={{ title: t('achievementsTitle') }} 
        />
        <Tab.Screen 
          name="waterIntakeGuide" 
          component={WaterIntakeGuideScreen} 
          options={{ title: t('waterIntakeGuide') }} 
        />
        <Tab.Screen 
          name="settings" 
          component={SettingsScreen} 
          options={{ title: t('settings') }} 
        />



      </Tab.Navigator>
  );
}

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
      initialRouteName="Login"
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={AppTabs}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};



// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH
  }),
});

const ThemedApp: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: currentTheme.colors.primary,
      background: currentTheme.colors.background,
      card: currentTheme.colors.surface,
      text: currentTheme.colors.text,
      border: currentTheme.colors.border,
      notification: currentTheme.colors.danger,
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <LanguageProvider>
        <UserProvider>
          <WaterGoalProvider>
            <AchievementProvider>
              <LeaderboardProvider>
                <AppNavigator />
              </LeaderboardProvider>
            </AchievementProvider>
          </WaterGoalProvider>
        </UserProvider>
      </LanguageProvider>
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    const configureNotifications = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission Required', 'Push notifications are required for water reminders');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    configureNotifications();
  }, []);

  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}


