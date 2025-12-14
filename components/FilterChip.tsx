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
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
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
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  activeChip: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 2,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  activeText: {
    color: theme.colors.accent.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});


