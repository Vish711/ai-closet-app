/**
 * EmptyClosetState - Enhanced empty state with illustration and helpful guidance
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { GlowButton } from './GlowButton';
import { theme } from '@/theme';

interface EmptyClosetStateProps {
  hasSearchQuery: boolean;
  searchQuery?: string;
  onAddItem: () => void;
  onImportPhotos?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const EmptyClosetState: React.FC<EmptyClosetStateProps> = ({
  hasSearchQuery,
  searchQuery,
  onAddItem,
  onImportPhotos,
}) => {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (!hasSearchQuery) {
      pulseScale.value = withRepeat(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [hasSearchQuery]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (hasSearchQuery) {
    return (
      <AnimatedView
        entering={FadeInDown.duration(300)}
        style={styles.container}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔍</Text>
        </View>
        <Text style={styles.title}>No results found</Text>
        <Text style={styles.subtitle}>
          No items match "{searchQuery}"
        </Text>
        <Text style={styles.hint}>
          Try adjusting your search or filters
        </Text>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView
      entering={FadeInDown.duration(400)}
      style={styles.container}
    >
      <AnimatedView style={[styles.iconContainer, pulseStyle]}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>👕</Text>
        </View>
      </AnimatedView>
      
      <Text style={styles.title}>Your closet is empty</Text>
      <Text style={styles.subtitle}>
        Start building your digital wardrobe
      </Text>

      <View style={styles.bullets}>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletIcon}>✓</Text>
          <Text style={styles.bulletText}>
            Add items once, build outfits fast
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletIcon}>✓</Text>
          <Text style={styles.bulletText}>
            Filter by category and color
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <GlowButton
          title="Add Your First Item"
          onPress={onAddItem}
          variant="primary"
          style={styles.primaryButton}
        />
        {onImportPhotos && (
          <GlowButton
            title="Import from Photos"
            onPress={onImportPhotos}
            variant="outline"
            style={styles.secondaryButton}
            disabled={true}
          />
        )}
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 2,
    borderColor: theme.colors.border.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.glow,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  hint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  bullets: {
    width: '100%',
    maxWidth: 300,
    marginBottom: theme.spacing.xl,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  bulletIcon: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.accent.primary,
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * 1.5,
  },
  actions: {
    width: '100%',
    maxWidth: 300,
    gap: theme.spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    opacity: 0.6,
  },
});

