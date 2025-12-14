/**
 * ClothingItemCard - Card displaying a single clothing item
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ClothingItem } from '@/types';
import { FuturisticCard } from './FuturisticCard';
import { theme } from '@/theme';
import { calculateCostPerWear } from '@/services/aiStylist';

interface ClothingItemCardProps {
  item: ClothingItem;
  onPress?: () => void;
}

export const ClothingItemCard: React.FC<ClothingItemCardProps> = ({ item, onPress }) => {
  const costPerWear = calculateCostPerWear(item);

  const content = (
    <View style={styles.container}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {item.category}
        </Text>
        <Text style={styles.color} numberOfLines={1}>
          {item.color}
        </Text>
        {item.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        <View style={styles.stats}>
          <Text style={styles.statText}>
            Worn {item.wearCount}x
          </Text>
          <Text style={styles.statText}>
            ${costPerWear.toFixed(2)}/wear
          </Text>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <FuturisticCard style={styles.card}>
          {content}
        </FuturisticCard>
      </TouchableOpacity>
    );
  }

  return (
    <FuturisticCard style={styles.card}>
      {content}
    </FuturisticCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  container: {
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textTransform: 'capitalize',
  },
  color: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
    marginTop: theme.spacing.xs,
  },
  brand: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  statText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
});


