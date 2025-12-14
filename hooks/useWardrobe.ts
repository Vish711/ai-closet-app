/**
 * Custom hook for managing wardrobe state
 */

import { useState, useEffect, useCallback } from 'react';
import { ClothingItem, WardrobeFilters } from '@/types';
import * as storageSync from '@/services/storageSync';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WardrobeFilters>({});

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const allItems = await storageSync.getAllClothingItems();
      setItems(allItems);
    } catch (error) {
      console.error('Error loading wardrobe:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = useCallback(async (item: ClothingItem) => {
    try {
      await storageSync.saveClothingItem(item);
      await loadItems();
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }, [loadItems]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await storageSync.deleteClothingItem(id);
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }, [loadItems]);

  const filteredItems = items.filter(item => {
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(item.category)) return false;
    }
    if (filters.color && filters.color.length > 0) {
      if (!filters.color.includes(item.color)) return false;
    }
    if (filters.season && filters.season.length > 0) {
      if (!filters.season.includes(item.season)) return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        item.category.toLowerCase().includes(query) ||
        item.color.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }
    return true;
  });

  return {
    items: filteredItems,
    allItems: items,
    loading,
    filters,
    setFilters,
    addItem,
    deleteItem,
    refresh: loadItems,
  };
}


