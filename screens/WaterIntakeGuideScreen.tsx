import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { waterIntakeGuideStyles } from '../styles/waterIntakeGuideStyles';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWaterGoal } from '../contexts/WaterGoalContext';
import { lightTheme, darkTheme } from '../styles/theme';

type ActivityLevel = 'lightActivity' | 'moderate' | 'heavy';
type Temperature = 'cold' | 'temperate' | 'hot';
type Gender = 'male' | 'female' | '';

const WaterIntakeGuideScreen = () => {
    const { isDarkMode } = useTheme();
    const { t } = useLanguage();
    const { updateDailyGoal } = useWaterGoal();
    const currentTheme = isDarkMode ? darkTheme : lightTheme;
    const [gender, setGender] = useState<Gender>('');

    const [weight, setWeight] = useState('');
    const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');
    const [temperature, setTemperature] = useState<Temperature | ''>('');

    const activityMultipliers: Record<ActivityLevel, number> = {
        lightActivity: 1.1,
        moderate: 1.2,
        heavy: 1.3
    };

    const temperatureMultipliers: Record<Temperature, number> = {
        cold: 1.0,
        temperate: 1.1,
        hot: 1.2
    };

    const calculateWaterIntake = () => {
        if (!gender || !weight || !activityLevel || !temperature) {
            Alert.alert(t('missingInfo'), t('fillAllFields'));
            return;
        }

        const weightNum = parseFloat(weight);
        if (isNaN(weightNum) || weightNum <= 0) {
            Alert.alert(t('invalidWeight'), t('enterValidWeight'));
            return;
        }

        let baseIntake = gender === 'male' ? weightNum * 0.035 : weightNum * 0.031;

        if (activityLevel in activityMultipliers) {
            baseIntake *= activityMultipliers[activityLevel as ActivityLevel];
        }

        if (temperature in temperatureMultipliers) {
            baseIntake *= temperatureMultipliers[temperature as Temperature];
        }

        // Convert liters to milliliters (1L = 1000mL)
        const mlIntake = Math.round(baseIntake * 1000);

        Alert.alert(
            t('dailyWaterIntakeGoal'),
            t('recommendedIntake')
                .replace('${mlIntake}', mlIntake.toString())
                .replace('${weight}', weight)
                .replace('${activityLevel}', t(activityLevel))
                .replace('${temperature}', t(temperature))
                .replace('${gender}', t(gender)),

            [
                {
                    text: t('cancel'),
                    style: 'cancel'
                },
                {
                    text: t('setAsGoal'),
                    onPress: async () => {
                        try {
                            await updateDailyGoal(mlIntake);
                            Alert.alert(t('success'), t('goalSetSuccess'));
                        } catch (error) {
                            console.error('Error setting goal:', error);
                            Alert.alert(t('error'), t('goalUpdateError'));
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={[waterIntakeGuideStyles.container, { backgroundColor: currentTheme.colors.background }]}>
            <Text style={[waterIntakeGuideStyles.title, { color: currentTheme.colors.primary }]}>{t('waterIntakeGuide')}</Text>
            
            <Text style={[waterIntakeGuideStyles.label, { color: currentTheme.colors.text }]}>{t('gender')}</Text>

            <View style={[waterIntakeGuideStyles.pickerContainer, {
                borderColor: currentTheme.colors.primary,
                backgroundColor: currentTheme.colors.surface
            }]}>
                <Picker
                    selectedValue={gender}
                    onValueChange={(value) => setGender(value)}
                    style={[waterIntakeGuideStyles.picker, { color: currentTheme.colors.text }]}
                    dropdownIconColor={currentTheme.colors.text}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label={t('male')} value="male" />
                    <Picker.Item label={t('female')} value="female" />
                </Picker>
            </View>

            <Text style={[waterIntakeGuideStyles.label, { color: currentTheme.colors.text }]}>{t('weight')}</Text>
            <TextInput
                style={[waterIntakeGuideStyles.input, {
                    borderColor: currentTheme.colors.primary,
                    backgroundColor: currentTheme.colors.surface,
                    color: currentTheme.colors.text
                }]}
                placeholder={t('enterWeight')}
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />

            <Text style={[waterIntakeGuideStyles.label, { color: currentTheme.colors.text }]}>{t('activityLevel')}</Text>
            <View style={[waterIntakeGuideStyles.pickerContainer, {
                borderColor: currentTheme.colors.primary,
                backgroundColor: currentTheme.colors.surface
            }]}>
                <Picker
                    selectedValue={activityLevel}
                    onValueChange={(value) => setActivityLevel(value)}
                    style={[waterIntakeGuideStyles.picker, { color: currentTheme.colors.text }]}
                    dropdownIconColor={currentTheme.colors.text}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label={t('lightActivity')} value="lightActivity" />
                    <Picker.Item label={t('moderate')} value="moderate" />
                    <Picker.Item label={t('heavy')} value="heavy" />
                </Picker>
            </View>

            <Text style={[waterIntakeGuideStyles.label, { color: currentTheme.colors.text }]}>{t('temperature')}</Text>
            <View style={[waterIntakeGuideStyles.pickerContainer, {
                borderColor: currentTheme.colors.primary,
                backgroundColor: currentTheme.colors.surface
            }]}>
                <Picker
                    selectedValue={temperature}
                    onValueChange={(value) => setTemperature(value)}
                    style={[waterIntakeGuideStyles.picker, { color: currentTheme.colors.text }]}
                    dropdownIconColor={currentTheme.colors.text}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label={t('cold')} value="cold" />
                    <Picker.Item label={t('temperate')} value="temperate" />
                    <Picker.Item label={t('hot')} value="hot" />
                </Picker>
            </View>

            <TouchableOpacity 
                style={[waterIntakeGuideStyles.button, { backgroundColor: currentTheme.colors.primary }]} 
                onPress={calculateWaterIntake}
            >
                <Text style={[waterIntakeGuideStyles.buttonText, { color: currentTheme.colors.surface }]}>
                    {t('calculateWaterIntake')}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
};




export default WaterIntakeGuideScreen;