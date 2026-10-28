import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { Habit, HabitFilter, OverallDailyStats } from './src/types/habit';
import {
  loadHabitsFromStorage,
  toggleHabitCompletion,
  addHabitToStorage,
  updateHabitInStorage,
  deleteHabitFromStorage,
} from './src/services/habitStorage';
import { calculateStreakStats } from './src/utils/streakCalculator';
import { HeaderStats } from './src/components/HeaderStats';
import { FilterTabs } from './src/components/FilterTabs';
import { HabitCard } from './src/components/HabitCard';
import { CelebrationBanner } from './src/components/CelebrationBanner';
import { AddHabitModal } from './src/components/AddHabitModal';
import { HabitDetailModal } from './src/components/HabitDetailModal';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<HabitFilter>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [detailModalHabit, setDetailModalHabit] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Initial load
  const fetchHabits = useCallback(async () => {
    try {
      const data = await loadHabitsFromStorage();
      setHabits(data);
    } catch (err) {
      console.error('Failed to load habits:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHabits();
  }, [fetchHabits]);

  // Toggle completion today
  const handleToggleHabit = async (habitId: string) => {
    // Optimistic UI update
    const updated = await toggleHabitCompletion(habitId);
    setHabits(updated);

    // If detail modal is open for this habit, keep it synced
    if (detailModalHabit && detailModalHabit.id === habitId) {
      const current = updated.find((h) => h.id === habitId) || null;
      setDetailModalHabit(current);
    }
  };

  // Add or update habit
  const handleSaveHabit = async (habitData: {
    title: string;
    description: string;
    icon: string;
    color: string;
    category: any;
  }) => {
    if (editingHabit) {
      const updatedItem: Habit = {
        ...editingHabit,
        ...habitData,
      };
      const updated = await updateHabitInStorage(updatedItem);
      setHabits(updated);
      setEditingHabit(null);
    } else {
      const updated = await addHabitToStorage(habitData);
      setHabits(updated);
    }
  };

  // Delete habit
  const handleDeleteHabit = async (habitId: string) => {
    const updated = await deleteHabitFromStorage(habitId);
    setHabits(updated);
  };

  // Open edit modal
  const handleStartEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddModalOpen(true);
  };

  // Stats calculation
  const overallStats: OverallDailyStats = useMemo(() => {
    const totalHabits = habits.length;
    let completedTodayCount = 0;
    let bestActiveStreak = 0;
    let totalCompletionsAllTime = 0;

    habits.forEach((habit) => {
      const stats = calculateStreakStats(habit.completedDates);
      if (stats.isCompletedToday) {
        completedTodayCount += 1;
      }
      if (stats.currentStreak > bestActiveStreak) {
        bestActiveStreak = stats.currentStreak;
      }
      totalCompletionsAllTime += stats.totalCompletions;
    });

    const completionPercentage =
      totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

    return {
      totalHabits,
      completedTodayCount,
      completionPercentage,
      bestActiveStreak,
      totalCompletionsAllTime,
    };
  }, [habits]);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const stats = calculateStreakStats(habit.completedDates);
      if (filter === 'pending') {
        return !stats.isCompletedToday;
      }
      if (filter === 'completed') {
        return stats.isCompletedToday;
      }
      return true;
    });
  }, [habits, filter]);

  const filterCounts = useMemo(() => {
    let completed = 0;
    habits.forEach((h) => {
      const s = calculateStreakStats(h.completedDates);
      if (s.isCompletedToday) completed += 1;
    });
    return {
      all: habits.length,
      pending: habits.length - completed,
      completed,
    };
  }, [habits]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading habits & streaks...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        {/* Top Header & Daily Overview */}
        <HeaderStats stats={overallStats} />

        {/* 100% Celebration Banner */}
        {overallStats.totalHabits > 0 &&
          overallStats.completionPercentage === 100 && (
            <CelebrationBanner completedCount={overallStats.completedTodayCount} />
          )}

        {/* Filter Tabs */}
        <FilterTabs
          currentFilter={filter}
          onSelectFilter={setFilter}
          counts={filterCounts}
        />

        {/* Habit Cards List */}
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleToday={handleToggleHabit}
              onPressCard={(item) => setDetailModalHabit(item)}
              onLongPressCard={(item) => handleStartEdit(item)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={
                  filter === 'completed'
                    ? 'checkmark-circle-outline'
                    : filter === 'pending'
                    ? 'sparkles-outline'
                    : 'calendar-outline'
                }
                size={40}
                color="#9CA3AF"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'completed'
                ? 'No habits completed yet today'
                : filter === 'pending'
                ? 'All pending habits completed!'
                : 'No habits found'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'completed'
                ? 'Tap the check circle on any habit to start your streak.'
                : filter === 'pending'
                ? 'Great job, you are fully caught up for today!'
                : 'Tap the "+" button below to create your first habit.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (+ New Habit) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingHabit(null);
          setIsAddModalOpen(true);
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add / Edit Habit Modal */}
      <AddHabitModal
        visible={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Habit Details & Actions Modal */}
      <HabitDetailModal
        habit={detailModalHabit}
        visible={!!detailModalHabit}
        onClose={() => setDetailModalHabit(null)}
        onEdit={(habit) => {
          handleStartEdit(habit);
        }}
        onDelete={handleDeleteHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Room for FAB
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 50,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
