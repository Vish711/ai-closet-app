/**
 * ClosetScreen - Enhanced wardrobe browsing with dynamic UI
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ClothingItemCard } from '@/components/ClothingItemCard';
import { FilterChip } from '@/components/FilterChip';
import { GlowButton } from '@/components/GlowButton';
import { SearchBar } from '@/components/SearchBar';
import { EmptyClosetState } from '@/components/EmptyClosetState';
import { ClothingItem, ClothingCategory, Color } from '@/types';
import { theme as appTheme } from '@/theme';

export const ClosetScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items, allItems, loading, filters, setFilters } = useWardrobe();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'];
  const colors: Color[] = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'beige', 'multicolor'];

  // Calculate item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat] = allItems.filter(item => item.category === cat).length;
    });
    return counts;
  }, [allItems, categories]);

  // Calculate item counts per color
  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    colors.forEach(color => {
      counts[color] = allItems.filter(item => item.color === color).length;
    });
    return counts;
  }, [allItems, colors]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      (filters.category && filters.category.length > 0) ||
      (filters.color && filters.color.length > 0) ||
      (filters.season && filters.season.length > 0) ||
      filters.searchQuery
    );
  }, [filters]);

  const toggleFilter = (type: 'category' | 'color' | 'season', value: string) => {
    const currentFilters = filters[type] || [];
    const newFilters = currentFilters.includes(value as any)
      ? currentFilters.filter(v => v !== value)
      : [...currentFilters, value as any];
    
    setFilters({ ...filters, [type]: newFilters.length > 0 ? newFilters : undefined });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setFilters({ ...filters, searchQuery: text || undefined });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading wardrobe...</Text>
      </View>
    );
  }

  const isEmpty = items.length === 0;
  const hasSearchQuery = !!filters.searchQuery;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>My Closet</Text>
          <Text style={styles.subtitle}>
            {isEmpty ? 'No items' : `${items.length} ${items.length === 1 ? 'item' : 'items'}`}
            {allItems.length > 0 && items.length !== allItems.length && (
              <Text style={styles.filteredHint}> • {allItems.length} total</Text>
            )}
          </Text>
        </View>
        <GlowButton
          title="Add Item"
          onPress={() => navigation.navigate('AddItem' as never)}
          variant="primary"
          style={styles.addButton}
          accessibilityLabel="Add new clothing item"
          accessibilityRole="button"
        />
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by category, color, brand..."
      />

      {/* Filters Section */}
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            style={styles.clearFiltersContainer}
          >
            <TouchableOpacity
              onPress={clearFilters}
              style={styles.clearFiltersButton}
              accessibilityLabel="Clear all filters"
              accessibilityRole="button"
            >
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Category Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.filterRow} accessibilityRole="radiogroup" accessibilityLabel="Filter by category">
            {categories.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                active={filters.category?.includes(cat) || false}
                onPress={() => toggleFilter('category', cat)}
                count={categoryCounts[cat]}
              />
            ))}
          </View>
        </View>

        {/* Color Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Color</Text>
          <View style={styles.filterRow} accessibilityRole="radiogroup" accessibilityLabel="Filter by color">
            {colors.map(color => (
              <FilterChip
                key={color}
                label={color}
                active={filters.color?.includes(color) || false}
                onPress={() => toggleFilter('color', color)}
                count={colorCounts[color]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {isEmpty ? (
          <EmptyClosetState
            hasSearchQuery={hasSearchQuery}
            searchQuery={filters.searchQuery}
            onAddItem={() => navigation.navigate('AddItem' as never)}
            onImportPhotos={undefined} // Can be enabled later
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 50).duration(300)}
                layout={Layout.springify()}
              >
                <ClothingItemCard item={item} />
              </Animated.View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background.primary,
    padding: appTheme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: appTheme.spacing.md,
    paddingTop: appTheme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: appTheme.typography.fontSize['3xl'],
    fontWeight: appTheme.typography.fontWeight.bold,
    color: appTheme.colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: appTheme.spacing.xs,
  },
  subtitle: {
    fontSize: appTheme.typography.fontSize.sm,
    color: appTheme.colors.text.secondary,
  },
  filteredHint: {
    color: appTheme.colors.text.tertiary,
    fontSize: appTheme.typography.fontSize.xs,
  },
  addButton: {
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: appTheme.spacing.md,
    minWidth: 140,
  },
  filtersContainer: {
    maxHeight: 200,
    marginBottom: appTheme.spacing.md,
  },
  filtersContent: {
    paddingBottom: appTheme.spacing.sm,
  },
  clearFiltersContainer: {
    marginBottom: appTheme.spacing.md,
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    paddingVertical: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.md,
    backgroundColor: appTheme.colors.background.tertiary,
    borderRadius: appTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border.accent,
  },
  clearFiltersText: {
    color: appTheme.colors.accent.primary,
    fontSize: appTheme.typography.fontSize.sm,
    fontWeight: appTheme.typography.fontWeight.semibold,
  },
  filterSection: {
    marginBottom: appTheme.spacing.lg,
  },
  filterLabel: {
    fontSize: appTheme.typography.fontSize.base,
    fontWeight: appTheme.typography.fontWeight.bold,
    color: appTheme.colors.text.secondary,
    marginBottom: appTheme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentArea: {
    flex: 1,
    backgroundColor: appTheme.colors.background.secondary,
    borderRadius: appTheme.borderRadius.lg,
    padding: appTheme.spacing.md,
    ...appTheme.shadows.md,
  },
  list: {
    paddingBottom: appTheme.spacing.xl,
  },
  loadingText: {
    fontSize: appTheme.typography.fontSize.base,
    color: appTheme.colors.text.secondary,
    textAlign: 'center',
    marginTop: appTheme.spacing['2xl'],
  },
});
