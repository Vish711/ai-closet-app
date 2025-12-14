/**
 * OnboardingScreen - Enhanced first-time user experience
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowButton } from '@/components/GlowButton';
import { theme } from '@/theme';
import { setAppState as setAppStateSync } from '@/services/storageSync';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const handleComplete = async () => {
    try {
      await setAppStateSync({ hasCompletedOnboarding: true });
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete();
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background.primary, theme.colors.background.secondary, theme.colors.background.tertiary]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>AC</Text>
            </View>
          </View>
          <Text style={styles.title}>Welcome to AI Closet</Text>
          <Text style={styles.subtitle}>Your Personal Stylist</Text>
        </View>

        <View style={styles.features}>
          <FeatureCard
            number="01"
            title="Snap Your Wardrobe"
            description="Take photos of your clothes and organize them by category, color, and season. Build your digital closet effortlessly."
            color={theme.colors.accent.primary}
          />
          <FeatureCard
            number="02"
            title="Get Daily AI Fits"
            description="Receive personalized outfit suggestions based on your style, occasion, weather, and mood. Let AI be your stylist."
            color={theme.colors.accentPurple.primary}
          />
          <FeatureCard
            number="03"
            title="Track What You Wear"
            description="Log your outfits and see cost-per-wear analytics. Make smarter fashion choices and maximize your wardrobe."
            color={theme.colors.accent.secondary}
          />
        </View>

        <GlowButton
          title="Get Started"
          onPress={handleComplete}
          style={styles.button}
        />
      </ScrollView>
    </LinearGradient>
  );
};

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ number, title, description, color }) => (
  <View style={styles.featureCard}>
    <View style={[styles.featureNumber, { borderColor: color }]}>
      <Text style={[styles.featureNumberText, { color }]}>{number}</Text>
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.glow,
  },
  logoText: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'] + 8,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  features: {
    marginBottom: theme.spacing['2xl'],
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    ...theme.shadows.lg,
  },
  featureNumber: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  featureNumberText: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  button: {
    marginTop: theme.spacing.xl,
    width: '100%',
  },
});
