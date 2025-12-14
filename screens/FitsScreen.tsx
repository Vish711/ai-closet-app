/**
 * FitsScreen - AI outfit generation and saved outfits
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { OutfitCard } from '@/components/OutfitCard';
import { GlowButton } from '@/components/GlowButton';
import { FilterChip } from '@/components/FilterChip';
import { useWardrobe } from '@/hooks/useWardrobe';
import { generateOutfits, getWeatherForDate } from '@/services/aiStylist';
import { Outfit, SavedOutfit, Occasion, Mood, DressCode } from '@/types';
import { theme } from '@/theme';
import * as storage from '@/lib/storage';
import { format } from 'date-fns';

interface FitsScreenProps {
  onViewOutfit?: (outfit: SavedOutfit) => void;
}

export const FitsScreen: React.FC<FitsScreenProps> = ({ onViewOutfit }) => {
  const { allItems } = useWardrobe();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [lockedItems, setLockedItems] = useState<string[]>([]);

  const occasions: Occasion[] = ['casual', 'work', 'date', 'party', 'gym', 'formal', 'sporty'];
  const moods: Mood[] = ['comfy', 'streetwear', 'minimal', 'bold', 'elegant', 'edgy', 'relaxed'];

  useEffect(() => {
    loadSavedOutfits();
  }, []);

  const loadSavedOutfits = async () => {
    try {
      const saved = await storage.getSavedOutfits();
      setSavedOutfits(saved);
    } catch (error) {
      console.error('Error loading saved outfits:', error);
    }
  };

  const handleGenerate = async () => {
    if (allItems.length === 0) {
      Alert.alert('Empty Wardrobe', 'Add some items to your closet first!');
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString();
      const weather = await getWeatherForDate(today);

      const response = await generateOutfits({
        wardrobe: allItems,
        constraints: {
          date: today,
          weather,
          occasion: occasion || undefined,
          mood: mood || undefined,
          lockedItemIds: lockedItems.length > 0 ? lockedItems : undefined,
        },
      });

      setOutfits(response.outfits);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate outfits. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOutfit = async (outfit: Outfit) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const weather = await getWeatherForDate(today);

      const savedOutfit: SavedOutfit = {
        ...outfit,
        wornDate: today,
        weather,
      };

      await storage.saveOutfit(savedOutfit);
      await storage.saveCalendarEntry({
        date: today,
        outfitId: outfit.id,
        items: allItems.filter(item => outfit.itemIds.includes(item.id)),
      });

      await loadSavedOutfits();
      Alert.alert('Saved', 'Outfit saved to your history!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save outfit.');
      console.error(error);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleLockItem = (itemId: string) => {
    if (lockedItems.includes(itemId)) {
      setLockedItems(lockedItems.filter(id => id !== itemId));
    } else {
      setLockedItems([...lockedItems, itemId]);
    }
  };

  const clearFilters = () => {
    setOccasion(null);
    setMood(null);
    setLockedItems([]);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background.primary, theme.colors.background.secondary]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>AI Fits</Text>
          <Text style={styles.subtitle}>Personalized outfit suggestions</Text>
        </View>
      </View>

        <View style={styles.filters}>
          <Text style={styles.filterLabel}>Occasion</Text>
          <View style={styles.filterRow}>
            {occasions.map(occ => (
              <FilterChip
                key={occ}
                label={occ}
                active={occasion === occ}
                onPress={() => setOccasion(occ === occasion ? null : occ)}
              />
            ))}
          </View>

          <Text style={styles.filterLabel}>Mood</Text>
          <View style={styles.filterRow}>
            {moods.map(m => (
              <FilterChip
                key={m}
                label={m}
                active={mood === m}
                onPress={() => setMood(m === mood ? null : m)}
              />
            ))}
          </View>

          {(occasion || mood || lockedItems.length > 0) && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear Filters</Text>
            </TouchableOpacity>
          )}

          {lockedItems.length > 0 && (
            <View style={styles.lockedSection}>
              <Text style={styles.filterLabel}>Locked Items: {lockedItems.length}</Text>
            </View>
          )}
        </View>

        <GlowButton
          title={loading ? 'Generating...' : 'Generate Outfits'}
          onPress={handleGenerate}
          variant="primary"
          disabled={loading}
          style={styles.generateButton}
        />

        {outfits.length > 0 && (
          <View style={styles.outfitsSection}>
            <Text style={styles.sectionTitle}>Suggestions</Text>
            {outfits.map((outfit, index) => (
              <Animated.View
                key={outfit.id}
                entering={FadeInDown.delay(index * 100)}
              >
                <OutfitCard
                  outfit={outfit}
                  items={allItems}
                  onSave={() => handleSaveOutfit(outfit)}
                  onRegenerate={handleRegenerate}
                  onLockItem={handleLockItem}
                />
              </Animated.View>
            ))}
          </View>
        )}

        {savedOutfits.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.sectionTitle}>Saved Outfits</Text>
            {savedOutfits.slice(0, 5).map(outfit => (
              <TouchableOpacity
                key={outfit.id}
                onPress={() => onViewOutfit?.(outfit)}
                style={styles.savedOutfitCard}
              >
                <Text style={styles.savedOutfitDate}>
                  {format(new Date(outfit.wornDate), 'MMM d, yyyy')}
                </Text>
                <Text style={styles.savedOutfitText} numberOfLines={1}>
                  {outfit.styleExplanation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {outfits.length === 0 && !loading && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Tap "Generate Outfits" to get AI-powered style suggestions
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  titleContainer: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  filters: {
    marginBottom: theme.spacing.lg,
  },
  filterLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  clearButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  clearText: {
    color: theme.colors.accent.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  lockedSection: {
    marginTop: theme.spacing.sm,
  },
  generateButton: {
    marginBottom: theme.spacing.xl,
  },
  outfitsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  savedSection: {
    marginBottom: theme.spacing.xl,
  },
  savedOutfitCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  savedOutfitDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  savedOutfitText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});


