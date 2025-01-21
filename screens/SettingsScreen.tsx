import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, TextInput } from 'react-native';
import { settingsStyles } from '../styles/settingsStyles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { useAchievements } from '../contexts/AchievementContext';
import { useUser } from '../contexts/UserContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { Picker } from '@react-native-picker/picker';


import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const convertToML = (value: number, fromUnit: string): number => {
  switch (fromUnit) {
    case 'oz':
      return Math.round(value * 29.5735); // 1 oz = 29.5735 ml
    case 'cups':
      return Math.round(value * 236.588); // 1 cup = 236.588 ml
    default:
      return value;
  }
};

export default function SettingsScreen({ navigation }: Props) {
  const { isDarkMode, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logoutUser: contextLogoutUser, deleteUser, resetUserStats } = useUser();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const { dailyGoal, updateDailyGoal, resetProgress } = useWaterGoal();
  const { resetAchievements } = useAchievements();
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [unit, setUnit] = useState('ml');

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    // Convert current goal to new unit
    const currentGoalML = convertToML(parseInt(goalInput), unit);
    let newGoal: number;
    switch (newUnit) {
      case 'oz':
        newGoal = Math.round(currentGoalML / 29.5735);
        break;
      case 'cups':
        newGoal = Math.round(currentGoalML / 236.588);
        break;
      default:
        newGoal = currentGoalML;
    }
    setGoalInput(newGoal.toString());
  };



  useEffect(() => {
    setGoalInput(dailyGoal.toString());
  }, [dailyGoal]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('2');
  const [notificationSound, setNotificationSound] = useState('default');
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const [syncHealthApp, setSyncHealthApp] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [languageEnabled, setLanguageEnabled] = useState(true);
  const [exportEnabled, setExportEnabled] = useState(false);

  const saveSettings = async () => {
    try {
      // Update water goal first
      const newGoal = parseInt(goalInput);
      if (!isNaN(newGoal) && newGoal > 0) {
        const goalInML = convertToML(newGoal, unit);
        await updateDailyGoal(goalInML);
      }

      // Save other settings
      const settings = {
        unit,
        reminderFrequency,
        notificationSound,
        hapticFeedback,
        syncHealthApp,
        exportFormat,
        languageEnabled,
        exportEnabled,
        remindersEnabled,
      };
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('success'), t('settings.changesSaved')); // Add success alert
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(t('error'), t('settings.settingsSaveError'));
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem('userSettings');
        if (settings) {
          const parsed = JSON.parse(settings);
          setUnit(parsed.unit || 'ml');
          setReminderFrequency(parsed.reminderFrequency || '1');
          setNotificationSound(parsed.notificationSound || 'default');
          setHapticFeedback(parsed.hapticFeedback ?? true);
          setSyncHealthApp(parsed.syncHealthApp ?? false);
          setExportFormat(parsed.exportFormat || 'csv');
          setLanguageEnabled(parsed.languageEnabled ?? true);
          setExportEnabled(parsed.exportEnabled ?? false);
          setRemindersEnabled(parsed.remindersEnabled ?? true);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleReminderFrequencyChange = (value: string) => {
    setReminderFrequency(value);
  };

  const handleNotificationSoundChange = (value: string) => {
    setNotificationSound(value);
  };

  const handleExportFormatChange = (value: string) => {
    setExportFormat(value);
  };

  const handleExport = async () => {
    try {
      Alert.alert(t('success'), t('Data exported successfully'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert(t('error'), t('Export failed'));
    }
  };

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (value: boolean) => {
    setter(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };


  const handleResetData = async () => {
    Alert.alert(
      t('resetData'),
      t('resetDataConfirm'),
        [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('reset'),
                style: 'destructive',
                onPress: async () => {
                    try {
                        await resetProgress();
                        resetAchievements();
                        
                        // Reset user stats
                        if (currentUser) {
                            await resetUserStats(currentUser.username);
                        }
                        
                        // Reset all settings to defaults
                        setUnit('ml');
                        setReminderFrequency('1');
                        setNotificationSound('default');
                        setHapticFeedback(true);
                        setSyncHealthApp(false);
                        setExportFormat('csv');
                        setLanguageEnabled(true);
                        setExportEnabled(false);
                        setRemindersEnabled(true);
                        
                        setGoalInput('2000');
                        
                        // Clear all stored settings
                        await AsyncStorage.removeItem('userSettings');
                        
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        Alert.alert(t('success'), t('data Reset Success'));
                    } catch (error) {
                        console.error('Error resetting data:', error);
                        Alert.alert(t('error'), t('data Reset Error'));
                    }
                }
            }
        ]
    );
};


  const handleDeleteAccount = async () => {
    Alert.alert(
        t('settings.deleteAccount'),
        t('settings.deleteAccountConfirm'),
        [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('settings.delete'),
                style: 'destructive',
                onPress: async () => {
                    try {
                        if (currentUser) {
                            await deleteUser(currentUser.username);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        }
                    } catch (error) {
                        console.error('Error deleting account:', error);
                        Alert.alert(t('error'), t('settings.deleteAccountError'));
                    }
                }
            }
        ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
        t('logout'),
        t('logout Confirm'),
        [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('logout'),
                style: 'destructive',
                onPress: async () => {
                    try {
                        // Only remove user settings, keep rememberedUser data
                        await AsyncStorage.removeItem('userSettings');
                        contextLogoutUser();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    } catch (error) {
                        console.error('Error during logout:', error);
                        Alert.alert(t('error'), t('logout Error'));
                    }
                }
            }
        ]
    );
  };

  return (
    <ScrollView style={[settingsStyles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Text style={[settingsStyles.title, { color: currentTheme.colors.text }]}>{t('settings.title')}</Text>

      <View style={[settingsStyles.card, { backgroundColor: currentTheme.colors.surface }]}>
      <Text style={[settingsStyles.cardTitle, { color: currentTheme.colors.text }]}>{t('settings.dailyWaterGoal')}</Text>
      <Text style={[settingsStyles.cardDescription, { color: currentTheme.colors.textSecondary }]}>{t('settings.setHydrationTarget')}</Text>
      <View style={settingsStyles.row}>
        <TextInput
        style={[settingsStyles.input, { 
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text,
              backgroundColor: currentTheme.colors.background
            }]}
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="numeric"
            />

          <Text style={{ color: currentTheme.colors.text }}>{unit}</Text>
            <Picker
            selectedValue={unit}
            style={[settingsStyles.picker, { color: currentTheme.colors.text, backgroundColor: currentTheme.colors.surface }]}
            onValueChange={handleUnitChange}
            >
            <Picker.Item label={t('milliliters')} value="ml" />
            <Picker.Item label={t('ounces')} value="oz" />
            <Picker.Item label={t('cups')} value="cups" />
            </Picker>
        </View>


      </View>

        <View style={[settingsStyles.card, { backgroundColor: currentTheme.colors.surface }]}>
        <Text style={[settingsStyles.cardTitle, { color: currentTheme.colors.text }]}>{t('settings.notifications')}</Text>
        <Text style={[settingsStyles.cardDescription, { color: currentTheme.colors.textSecondary }]}>{t('settings.manageReminders')}</Text>
        <View style={settingsStyles.row}>
          <Text style={{ color: currentTheme.colors.text }}>{t('settings.reminders')}</Text>
            <Switch
            value={remindersEnabled}
            onValueChange={toggleSwitch(setRemindersEnabled)}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
            thumbColor={remindersEnabled ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
          />
        </View>
        {remindersEnabled && (
          <>
            <Text style={[{ color: currentTheme.colors.text, marginTop: 16 }]}>{t('settings.reminderFrequency')}</Text>
          <Picker
            selectedValue={reminderFrequency}
            style={[settingsStyles.picker, { 
            color: currentTheme.colors.text, 
            backgroundColor: currentTheme.colors.surface,
            marginTop: 8,
            }]}
            onValueChange={handleReminderFrequencyChange}
          >
            <Picker.Item label={t('every Hour')} value="1" />
            <Picker.Item label={t('every Two Hours')} value="2" />
            <Picker.Item label={t('every Three Hours')} value="3" />
            <Picker.Item label={t('every Four Hours')} value="4" />
          </Picker>
          </>
        )}
       
        <View style={settingsStyles.row}>
            <Text style={{ color: currentTheme.colors.text }}>{t('settings.hapticFeedback')}</Text>
            <Switch
            value={hapticFeedback}
            onValueChange={toggleSwitch(setHapticFeedback)}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
            thumbColor={hapticFeedback ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
          />
        </View>
      </View>

        <View style={[settingsStyles.card, { backgroundColor: currentTheme.colors.surface }]}>
        <Text style={[settingsStyles.cardTitle, { color: currentTheme.colors.text }]}>{t('settings.appearance')}</Text>
        <Text style={[settingsStyles.cardDescription, { color: currentTheme.colors.textSecondary }]}>{t('settings.customizeExperience')}</Text>
        
        <View style={settingsStyles.row}>

            <Text style={{ color: currentTheme.colors.text }}>{t('Dark Mode')}</Text>
          <Switch
          value={isDarkMode}
          onValueChange={(value) => {
            setTheme(value ? 'dark' : 'light');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          />
        </View>
        <View style={settingsStyles.row}>
          <Text style={{ color: currentTheme.colors.text }}>{t('Language')}</Text>
          <Switch
          value={languageEnabled}
          onValueChange={toggleSwitch(setLanguageEnabled)}
          trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
          thumbColor={languageEnabled ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
          />
        </View>
        {languageEnabled && (
          <Picker
          selectedValue={language}
            style={[settingsStyles.picker, { 
            color: currentTheme.colors.text, 
            backgroundColor: currentTheme.colors.surface,
            marginTop: 8,
          }]}
          onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            <Picker.Item label={t('english')} value="en" />
            <Picker.Item label={t('spanish')} value="es" />
            <Picker.Item label={t('french')} value="fr" />

          </Picker>
        )}
      </View>

        <View style={[settingsStyles.card, { backgroundColor: currentTheme.colors.surface }]}>
        <Text style={[settingsStyles.cardTitle, { color: currentTheme.colors.text }]}>{t('settings.dataManagement')}</Text>
        <Text style={[settingsStyles.cardDescription, { color: currentTheme.colors.textSecondary }]}>{t('settings.manageData')}</Text>
        <View style={settingsStyles.row}>
            <Text style={{ color: currentTheme.colors.text }}>{t('Sync with health App')}</Text>
            <Switch
            value={syncHealthApp}
            onValueChange={toggleSwitch(setSyncHealthApp)}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
            thumbColor={syncHealthApp ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
          />
        </View>
        <View style={settingsStyles.row}>
          <Text style={{ color: currentTheme.colors.text }}>{t('Export data')}</Text>
          <Switch
          value={exportEnabled}
          onValueChange={toggleSwitch(setExportEnabled)}
          trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
          thumbColor={exportEnabled ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
          />
        </View>
        {exportEnabled && (
            <View style={settingsStyles.exportContainer}>
          <Picker
            selectedValue={exportFormat}
            style={[settingsStyles.exportPicker, { 
            color: currentTheme.colors.text, 
            backgroundColor: currentTheme.colors.surface,
            marginTop: 8,
            }]}
            onValueChange={handleExportFormatChange}
          >
            <Picker.Item label={t('csv')} value="csv" />
            <Picker.Item label={t('json')} value="json" />
          </Picker>
          <TouchableOpacity 
            style={[settingsStyles.exportButton, { backgroundColor: currentTheme.colors.primary }]}
            onPress={handleExport}
            >
            <Text style={[settingsStyles.buttonText, { color: '#fff' }]}>{t('Export')}</Text>
          </TouchableOpacity>
          </View>
        )}
        <View style={settingsStyles.buttonRow}>
          <TouchableOpacity 
          style={[settingsStyles.buttonDanger, { 
          backgroundColor: currentTheme.colors.danger,
          flex: 1,
          marginRight: 8,
          }]} 
          onPress={handleResetData}
          >
            <Text style={[settingsStyles.buttonText, { color: '#fff' }]}>{t('resetData')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={[settingsStyles.buttonDanger, { 
          backgroundColor: currentTheme.colors.danger,
          flex: 1,
          marginLeft: 8,
          }]} 
          onPress={handleDeleteAccount}
          >
          <Text style={[settingsStyles.buttonText, { color: '#fff' }]}>{t('settings.deleteAccount')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[settingsStyles.buttonOutline, { 
          borderColor: currentTheme.colors.primary,
          backgroundColor: 'transparent',
          width: '100%',
          marginTop: 8,
        }]} 
        onPress={handleLogout}
        >
          <Text style={[settingsStyles.buttonOutlineText, { color: currentTheme.colors.primary }]}>{t('logout')}</Text>
        </TouchableOpacity>
        </View>

        <TouchableOpacity 
        style={[settingsStyles.saveButton, { backgroundColor: currentTheme.colors.primary }]} 
        onPress={saveSettings}
        >
        <Text style={[settingsStyles.buttonText, { color: '#fff' }]}>{t('settings.saveChanges')}</Text>
        </TouchableOpacity>
      </ScrollView>
  );
}




