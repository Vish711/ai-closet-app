/**
 * OutfitCard - Card displaying an AI-generated outfit suggestion
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Outfit, ClothingItem } from '@/types';
import { FuturisticCard } from './FuturisticCard';
import { GlowButton } from './GlowButton';
import { OutfitPreview } from './OutfitPreview';
import { theme } from '@/theme';

interface OutfitCardProps {
  outfit: Outfit;
  items: ClothingItem[]; // Full item objects for display
  onSave?: () => void;
  onRegenerate?: () => void;
  onLockItem?: (itemId: string) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  items,
  onSave,
  onRegenerate,
  onLockItem,
}) => {
  const outfitItems = items.filter(item => outfit.itemIds.includes(item.id));

  return (
    <FuturisticCard style={styles.card} glow>
      <View style={styles.header}>
        <Text style={styles.title}>Outfit Suggestion</Text>
        {outfit.occasion && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{outfit.occasion}</Text>
          </View>
        )}
      </View>

      {/* Outfit Preview */}
      <OutfitPreview outfit={outfit} items={items} style="detailed" />

      {/* Quick item list for locking */}
      <View style={styles.itemsSection}>
        <Text style={styles.itemsSectionTitle}>Items (tap to lock)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.itemsContainer}
          contentContainerStyle={styles.itemsContent}
        >
          {outfitItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemPreview}
              onPress={() => onLockItem?.(item.id)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
              <Text style={styles.itemLabel} numberOfLines={1}>
                {item.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        {onSave && (
          <GlowButton
            title="Save Outfit"
            onPress={onSave}
            variant="primary"
            style={styles.actionButton}
          />
        )}
        {onRegenerate && (
          <GlowButton
            title="Regenerate"
            onPress={onRegenerate}
            variant="outline"
            style={styles.actionButton}
          />
        )}
      </View>
    </FuturisticCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.accent,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.accent.primary,
    textTransform: 'capitalize',
  },
  itemsSection: {
    marginBottom: theme.spacing.md,
  },
  itemsSectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  itemsContainer: {
    marginBottom: theme.spacing.md,
  },
  itemsContent: {
    gap: theme.spacing.sm,
  },
  itemPreview: {
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.tertiary,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  itemLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});


