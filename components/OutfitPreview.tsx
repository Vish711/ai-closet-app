/**
 * OutfitPreview - Visual preview of how an outfit looks
 * Shows items arranged in a styled mannequin/figure layout
 */

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Outfit, ClothingItem } from '@/types';
import { theme } from '@/theme';

interface OutfitPreviewProps {
  outfit: Outfit;
  items: ClothingItem[];
  style?: 'compact' | 'detailed';
}

const { width } = Dimensions.get('window');

export const OutfitPreview: React.FC<OutfitPreviewProps> = ({
  outfit,
  items,
  style = 'detailed',
}) => {
  const outfitItems = items.filter(item => outfit.itemIds.includes(item.id));

  // Organize items by category for better visualization
  const organizedItems = {
    outerwear: outfitItems.filter(item => item.category === 'outerwear'),
    tops: outfitItems.filter(item => item.category === 'tops'),
    bottoms: outfitItems.filter(item => item.category === 'bottoms'),
    shoes: outfitItems.filter(item => item.category === 'shoes'),
    accessories: outfitItems.filter(item => item.category === 'accessories'),
  };

  if (style === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {outfitItems.map(item => (
            <View key={item.id} style={styles.compactItem}>
              <Image source={{ uri: item.imageUri }} style={styles.compactImage} />
              <Text style={styles.compactLabel} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background.elevated, theme.colors.background.tertiary]}
        style={styles.previewCard}
      >
        <Text style={styles.previewTitle}>Outfit Preview</Text>
        
        {/* Mannequin-style layout */}
        <View style={styles.mannequinContainer}>
          {/* Head/Accessories area */}
          {organizedItems.accessories.length > 0 && (
            <View style={styles.accessoriesRow}>
              {organizedItems.accessories.map(item => (
                <View key={item.id} style={styles.accessoryItem}>
                  <Image source={{ uri: item.imageUri }} style={styles.accessoryImage} />
                  <Text style={styles.itemLabel}>{item.category}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Outerwear layer */}
          {organizedItems.outerwear.length > 0 && (
            <View style={styles.layer}>
              <Text style={styles.layerLabel}>Outerwear</Text>
              <View style={styles.itemsRow}>
                {organizedItems.outerwear.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    <Text style={styles.itemLabel}>{item.category}</Text>
                    <Text style={styles.itemColor}>{item.color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tops layer */}
          {organizedItems.tops.length > 0 && (
            <View style={styles.layer}>
              <Text style={styles.layerLabel}>Top</Text>
              <View style={styles.itemsRow}>
                {organizedItems.tops.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    <Text style={styles.itemLabel}>{item.category}</Text>
                    <Text style={styles.itemColor}>{item.color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Bottoms layer */}
          {organizedItems.bottoms.length > 0 && (
            <View style={styles.layer}>
              <Text style={styles.layerLabel}>Bottom</Text>
              <View style={styles.itemsRow}>
                {organizedItems.bottoms.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    <Text style={styles.itemLabel}>{item.category}</Text>
                    <Text style={styles.itemColor}>{item.color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Shoes layer */}
          {organizedItems.shoes.length > 0 && (
            <View style={styles.layer}>
              <Text style={styles.layerLabel}>Shoes</Text>
              <View style={styles.itemsRow}>
                {organizedItems.shoes.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    <Text style={styles.itemLabel}>{item.category}</Text>
                    <Text style={styles.itemColor}>{item.color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Style explanation */}
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>Why This Works</Text>
          <Text style={styles.explanationText}>{outfit.styleExplanation}</Text>
        </View>

        {/* Color palette */}
        <View style={styles.colorPalette}>
          <Text style={styles.paletteLabel}>Color Palette</Text>
          <View style={styles.colorSwatches}>
            {Array.from(new Set(outfitItems.map(item => item.color))).map(color => (
              <View key={color} style={styles.colorSwatch}>
                <View style={[styles.colorDot, { backgroundColor: getColorHex(color) }]} />
                <Text style={styles.colorName}>{color}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Color mapping for visual swatches
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    navy: '#000080',
    blue: '#0000FF',
    red: '#FF0000',
    green: '#008000',
    yellow: '#FFFF00',
    orange: '#FFA500',
    pink: '#FFC0CB',
    purple: '#800080',
    brown: '#A52A2A',
    beige: '#F5F5DC',
    multicolor: '#FF00FF',
  };
  return colorMap[color.toLowerCase()] || '#808080';
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  previewCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.accent,
    ...theme.shadows.md,
  },
  previewTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  mannequinContainer: {
    marginBottom: theme.spacing.lg,
  },
  layer: {
    marginBottom: theme.spacing.md,
  },
  layerLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  itemCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
    marginBottom: theme.spacing.xs,
  },
  itemLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  itemColor: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: 'capitalize',
  },
  accessoriesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  accessoryItem: {
    alignItems: 'center',
  },
  accessoryImage: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
  },
  explanationBox: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent.primary,
  },
  explanationTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  explanationText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.sm * 1.5,
  },
  colorPalette: {
    marginTop: theme.spacing.md,
  },
  paletteLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  colorSwatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  colorSwatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  colorName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  compactContainer: {
    marginBottom: theme.spacing.md,
  },
  compactItem: {
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  compactImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
    marginBottom: theme.spacing.xs,
  },
  compactLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: 'capitalize',
  },
});

