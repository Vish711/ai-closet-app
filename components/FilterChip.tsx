/**
 * FilterChip - Pill-shaped filter button with accent outline when active
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { theme } from '@/theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  count?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress, count }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      style={[styles.chip, active && styles.activeChip, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
        {count !== undefined && (
          <Text style={[styles.count, active && styles.activeCount]}>
            {' · '}{count}
          </Text>
        )}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minHeight: 44,
  },
  activeChip: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 2,
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  activeText: {
    color: theme.colors.accent.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  count: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  activeCount: {
    color: theme.colors.accent.secondary,
  },
});


