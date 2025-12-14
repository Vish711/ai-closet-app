/**
 * Main App Entry Point
 * Handles navigation, onboarding, and main app flow
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ClosetScreen } from './screens/ClosetScreen';
import { AddItemScreen } from './screens/AddItemScreen';
import { FitsScreen } from './screens/FitsScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { ProfileScreen } from './screens/ProfileScreen';

import { theme } from './theme';
import { initStorage, getAppState as getAppStateSync, setAppState as setAppStateSync } from './services/storageSync';
import { apiService } from './services/api';
import { setUseBackend } from './services/storageSync';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ClosetStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.primary },
      }}
    >
      <Stack.Screen name="ClosetMain" component={ClosetScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.elevated,
          borderTopColor: theme.colors.border.secondary,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.accent.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: theme.typography.fontWeight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Closet"
        component={ClosetStack}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👕</Text>,
        }}
      />
      <Tab.Screen
        name="Fits"
        component={FitsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🤖</Text>,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOnboarding, setHasOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize storage (local + sync)
      await initStorage();
      
      // Check if user is logged in
      const token = apiService.getToken();
      let loggedIn = false;
      if (token) {
        // Verify token is still valid
        const verifyResponse = await apiService.verifyToken();
        if (verifyResponse.data?.valid) {
          loggedIn = true;
          setIsLoggedIn(true);
          setUseBackend(true);
        } else {
          // Token invalid, clear it
          apiService.logout();
        }
      }

      // Check onboarding status
      const appState = await getAppStateSync();
      setHasOnboarding(appState.hasCompletedOnboarding);
      setShowOnboarding(!appState.hasCompletedOnboarding && loggedIn);
      setShowLogin(!loggedIn);
    } catch (error) {
      console.error('Error initializing app:', error);
      // On error, show login
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggedIn(true);
    setUseBackend(true);
    
    // Check onboarding status after login
    const appState = await getAppStateSync();
    setHasOnboarding(appState.hasCompletedOnboarding);
    setShowOnboarding(!appState.hasCompletedOnboarding);
    setShowLogin(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasOnboarding(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={styles.loadingText}>Loading AI Closet...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: theme.colors.accent.primary,
            background: theme.colors.background.primary,
            card: theme.colors.background.elevated,
            text: theme.colors.text.primary,
            border: theme.colors.border.secondary,
            notification: theme.colors.accent.primary,
          },
        }}
      >
        {showLogin ? (
          <LoginScreen onLogin={handleLogin} onSignup={handleLogin} />
        ) : showOnboarding ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <MainTabs />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
});


