/**
 * CalendarScreen - Calendar view of logged outfits
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CalendarEntry } from '@/types';
import { theme } from '@/theme';
import * as storage from '@/lib/storage';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { FuturisticCard } from '@/components/FuturisticCard';

export const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarEntries();
  }, [selectedDate]);

  const loadCalendarEntries = async () => {
    try {
      setLoading(true);
      const start = startOfMonth(selectedDate).toISOString().split('T')[0];
      const end = endOfMonth(selectedDate).toISOString().split('T')[0];
      const monthEntries = await storage.getCalendarEntries(start, end);
      setEntries(monthEntries);
    } catch (error) {
      console.error('Error loading calendar entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  const getEntryForDate = (date: Date): CalendarEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(entry => entry.date === dateStr);
  };

  const selectedEntry = getEntryForDate(selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {format(selectedDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
        {days.map(day => {
          const entry = getEntryForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDay,
                isToday && styles.todayDay,
                entry && styles.hasEntryDay,
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isToday && styles.todayDayText,
                ]}
              >
                {format(day, 'd')}
              </Text>
              {entry && <View style={styles.entryDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.details} contentContainerStyle={styles.detailsContent}>
        {selectedEntry && selectedEntry.items.length > 0 ? (
          <FuturisticCard glow>
            <Text style={styles.detailsTitle}>
              {format(parseISO(selectedEntry.date), 'EEEE, MMMM d')}
            </Text>
            <View style={styles.itemsGrid}>
              {selectedEntry.items.map(item => (
                <View key={item.id} style={styles.itemPreview}>
                  <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  <Text style={styles.itemLabel} numberOfLines={1}>
                    {item.category}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.stats}>
              <Text style={styles.statText}>
                Items: {selectedEntry.items.length}
              </Text>
              <Text style={styles.statText}>
                Total Cost: ${selectedEntry.items.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
              </Text>
            </View>
          </FuturisticCard>
        ) : (
          <View style={styles.noEntry}>
            <Text style={styles.noEntryText}>
              No outfit logged for {format(selectedDate, 'MMMM d')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  navButton: {
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.accent.primary,
    fontWeight: theme.typography.fontWeight.bold,
    paddingHorizontal: theme.spacing.md,
  },
  monthTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.background.tertiary,
  },
  dayHeader: {
    width: '14.28%',
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.tertiary,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    margin: theme.spacing.xs / 2,
    backgroundColor: theme.colors.background.secondary,
  },
  selectedDay: {
    backgroundColor: theme.colors.accent.primary,
    ...theme.shadows.glow,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: theme.colors.accent.primary,
  },
  hasEntryDay: {
    borderWidth: 1,
    borderColor: theme.colors.border.accent,
  },
  dayText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  selectedDayText: {
    color: theme.colors.background.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  todayDayText: {
    color: theme.colors.accent.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  entryDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent.primary,
  },
  details: {
    flex: 1,
  },
  detailsContent: {
    paddingBottom: theme.spacing.xl,
  },
  detailsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  itemPreview: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.tertiary,
    marginBottom: theme.spacing.xs,
  },
  itemLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
  },
  statText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  noEntry: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  noEntryText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});


