/**
 * ProfileScreen - User settings and preferences
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { GlowButton } from '@/components/GlowButton';
import { FilterChip } from '@/components/FilterChip';
import { theme } from '@/theme';
import * as storage from '@/lib/storage';
import { UserPreferences, DressCode, Color, Mood } from '@/types';
import { setApiBaseUrl, getApiBaseUrlValue } from '@/services/api';

export const ProfileScreen: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [city, setCity] = useState('');
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [dressCode, setDressCode] = useState<DressCode | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);

  const dressCodes: DressCode[] = ['casual', 'business-casual', 'business', 'formal', 'smart-casual'];
  const colors: Color[] = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'beige'];
  const moods: Mood[] = ['comfy', 'streetwear', 'minimal', 'bold', 'elegant', 'edgy', 'relaxed'];

  useEffect(() => {
    loadPreferences();
    loadApiUrl();
  }, []);

  const loadApiUrl = () => {
    const currentUrl = getApiBaseUrlValue();
    setApiUrl(currentUrl);
  };

  const loadPreferences = async () => {
    try {
      const state = await storage.getAppState();
      const prefs = state.preferences || {};
      setPreferences(prefs);
      setCity(prefs.defaultCity || '');
      setSelectedColors(prefs.preferredColorPalette || []);
      setSelectedMoods(prefs.favoriteMoods || []);
      setDressCode(prefs.defaultDressCode || null);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    const newPreferences: UserPreferences = {
      defaultCity: city || undefined,
      preferredColorPalette: selectedColors.length > 0 ? selectedColors : undefined,
      defaultDressCode: dressCode || undefined,
      favoriteMoods: selectedMoods.length > 0 ? selectedMoods : undefined,
    };

    try {
      await storage.setAppState({ preferences: newPreferences });
      setPreferences(newPreferences);
      // Show success feedback
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const toggleColor = (color: Color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const toggleMood = (mood: Mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Backend Server URL</Text>
          <TouchableOpacity onPress={() => setShowApiSettings(!showApiSettings)}>
            <Text style={styles.toggleText}>
              {showApiSettings ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        {showApiSettings && (
          <>
            <Text style={styles.hint}>
              {Platform.OS === 'web' 
                ? 'Enter your backend server URL. Default: https://ai-closet-backend.onrender.com/api'
                : 'Enter your computer\'s IP address where the backend is running, or use the online backend URL.'}
            </Text>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder={Platform.OS === 'web' 
                ? 'https://ai-closet-backend.onrender.com/api'
                : 'http://192.168.1.100:3000/api'}
              placeholderTextColor={theme.colors.text.tertiary}
              autoCapitalize="none"
            />
            <GlowButton
              title="Save API URL"
              onPress={() => {
                setApiBaseUrl(apiUrl);
                Alert.alert('Saved', 'API URL updated. The app will now use this URL for all requests.');
              }}
              variant="secondary"
              style={styles.saveApiButton}
            />
            {Platform.OS !== 'web' && (
              <View style={styles.helpBox}>
                <Text style={styles.helpTitle}>How to find your IP:</Text>
                <Text style={styles.helpText}>
                  On your computer, run:{'\n'}
                  Windows: ipconfig{'\n'}
                  Mac/Linux: ifconfig{'\n'}
                  Look for IPv4 Address
                </Text>
              </View>
            )}
            {Platform.OS === 'web' && (
              <View style={styles.helpBox}>
                <Text style={styles.helpTitle}>Online Backend:</Text>
                <Text style={styles.helpText}>
                  Your backend is hosted on Render.com{'\n'}
                  Default URL: https://ai-closet-backend.onrender.com/api{'\n'}
                  Leave empty to use default, or enter a custom URL.
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Default City</Text>
        <Text style={styles.hint}>Used for weather-based outfit suggestions</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city name"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Preferred Color Palette</Text>
        <Text style={styles.hint}>Select colors you prefer in outfits</Text>
        <View style={styles.chipRow}>
          {colors.map(color => (
            <FilterChip
              key={color}
              label={color}
              active={selectedColors.includes(color)}
              onPress={() => toggleColor(color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Default Dress Code</Text>
        <View style={styles.chipRow}>
          {dressCodes.map(code => (
            <FilterChip
              key={code}
              label={code}
              active={dressCode === code}
              onPress={() => setDressCode(code === dressCode ? null : code)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Favorite Moods</Text>
        <Text style={styles.hint}>Style moods you gravitate towards</Text>
        <View style={styles.chipRow}>
          {moods.map(m => (
            <FilterChip
              key={m}
              label={m}
              active={selectedMoods.includes(m)}
              onPress={() => toggleMood(m)}
            />
          ))}
        </View>
      </View>

      <GlowButton
        title="Save Preferences"
        onPress={handleSave}
        variant="primary"
        style={styles.saveButton}
      />

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About</Text>
        <Text style={styles.infoText}>AI Closet v1.0.0</Text>
        <Text style={styles.infoText}>Your personal AI stylist</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  titleContainer: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  hint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    color: theme.colors.text.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    fontSize: theme.typography.fontSize.lg,
    minHeight: 56,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    width: '100%',
  },
  infoSection: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  saveApiButton: {
    marginTop: theme.spacing.sm,
  },
  helpBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  helpTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  helpText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.xs * 1.5,
  },
});


