/**
 * ClosetScreen - Main wardrobe browsing and management
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ClothingItemCard } from '@/components/ClothingItemCard';
import { FilterChip } from '@/components/FilterChip';
import { GlowButton } from '@/components/GlowButton';
import { ClothingItem, ClothingCategory, Color, Season } from '@/types';
import { theme as appTheme } from '@/theme';

export const ClosetScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items, loading, filters, setFilters } = useWardrobe();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'];
  const colors: Color[] = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'beige', 'multicolor'];
  const seasons: Season[] = ['spring', 'summer', 'fall', 'winter', 'all-season'];

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading wardrobe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Closet</Text>
          <Text style={styles.subtitle}>{items.length} items</Text>
        </View>
        <GlowButton
          title="Add Item"
          onPress={() => navigation.navigate('AddItem' as never)}
          variant="primary"
          style={styles.addButton}
        />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={appTheme.colors.text.tertiary}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Category</Text>
        <View style={styles.filterRow}>
          {categories.map(cat => (
            <FilterChip
              key={cat}
              label={cat}
              active={filters.category?.includes(cat) || false}
              onPress={() => toggleFilter('category', cat)}
            />
          ))}
        </View>

        <Text style={styles.filterLabel}>Color</Text>
        <View style={styles.filterRow}>
          {colors.slice(0, 8).map(color => (
            <FilterChip
              key={color}
              label={color}
              active={filters.color?.includes(color) || false}
              onPress={() => toggleFilter('color', color)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ClothingItemCard
            item={item}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items in your closet yet</Text>
            <GlowButton
              title="Add Your First Item"
              onPress={() => navigation.navigate('AddItem' as never)}
              variant="outline"
              style={styles.emptyButton}
            />
          </View>
        }
      />
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
    alignItems: 'center',
    marginBottom: appTheme.spacing.md,
  },
  title: {
    fontSize: appTheme.typography.fontSize['2xl'],
    fontWeight: appTheme.typography.fontWeight.bold,
    color: appTheme.colors.text.primary,
  },
  subtitle: {
    fontSize: appTheme.typography.fontSize.sm,
    color: appTheme.colors.text.tertiary,
    marginTop: appTheme.spacing.xs,
  },
  addButton: {
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: appTheme.spacing.sm,
  },
  searchInput: {
    backgroundColor: appTheme.colors.background.tertiary,
    borderRadius: appTheme.borderRadius.md,
    padding: appTheme.spacing.md,
    color: appTheme.colors.text.primary,
    marginBottom: appTheme.spacing.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border.secondary,
  },
  filters: {
    marginBottom: appTheme.spacing.md,
  },
  filterLabel: {
    fontSize: appTheme.typography.fontSize.sm,
    fontWeight: appTheme.typography.fontWeight.semibold,
    color: appTheme.colors.text.secondary,
    marginBottom: appTheme.spacing.sm,
    marginTop: appTheme.spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  list: {
    paddingBottom: appTheme.spacing.xl,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: appTheme.spacing['3xl'],
  },
  emptyText: {
    fontSize: appTheme.typography.fontSize.base,
    color: appTheme.colors.text.tertiary,
    marginBottom: appTheme.spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
  loadingText: {
    fontSize: appTheme.typography.fontSize.base,
    color: appTheme.colors.text.secondary,
    textAlign: 'center',
    marginTop: appTheme.spacing['2xl'],
  },
});

