/**
 * FuturisticCard - Card component with dark theme and subtle glow effects
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '@/theme';

interface FuturisticCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  onPress?: () => void;
}

export const FuturisticCard: React.FC<FuturisticCardProps> = ({
  children,
  style,
  glow = false,
  onPress,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 }],
    };
  });

  const cardContent = (
    <View
      style={[
        styles.card,
        glow && styles.glowCard,
        style,
      ]}
    >
      {glow && (
        <LinearGradient
          colors={['rgba(0, 245, 255, 0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        {cardContent}
      </Animated.View>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    ...theme.shadows.md,
  },
  glowCard: {
    borderColor: theme.colors.border.accent,
    ...theme.shadows.glow,
  },
});


