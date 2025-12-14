/**
 * SearchBar - Enhanced search input with icon, clear button, and debounce
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { theme } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearButtonOpacity = useSharedValue(value ? 1 : 0);
  const clearButtonScale = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onChangeText(localValue);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localValue, debounceMs, onChangeText]);

  useEffect(() => {
    if (!value && localValue) {
      setLocalValue('');
    }
  }, [value]);

  useEffect(() => {
    const hasValue = localValue.length > 0;
    clearButtonOpacity.value = withTiming(hasValue ? 1 : 0, { duration: 200 });
    clearButtonScale.value = withSpring(hasValue ? 1 : 0, { damping: 15, stiffness: 300 });
  }, [localValue]);

  const handleClear = () => {
    setLocalValue('');
    onChangeText('');
  };

  const clearButtonStyle = useAnimatedStyle(() => ({
    opacity: clearButtonOpacity.value,
    transform: [{ scale: clearButtonScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Text style={styles.searchIconText}>🔍</Text>
      </View>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={setLocalValue}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search clothing items"
        accessibilityHint="Type to search by category, color, brand, or tags"
      />
      <AnimatedTouchable
        style={[styles.clearButton, clearButtonStyle]}
        onPress={handleClear}
        activeOpacity={0.7}
        accessibilityLabel="Clear search"
        accessibilityRole="button"
      >
        <Text style={styles.clearButtonText}>✕</Text>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    paddingHorizontal: theme.spacing.md,
    minHeight: 56,
    marginBottom: theme.spacing.lg,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchIconText: {
    fontSize: theme.typography.fontSize.lg,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    paddingVertical: theme.spacing.md,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  clearButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

