import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/habit';
import { getTodayKey, formatDateToKey } from '../utils/dateUtils';

const STORAGE_KEY = '@habit_streak_tracker:habits_v1';

// Initial seed habits so the app is immediately alive and demonstrative
export const DEFAULT_SEED_HABITS: Habit[] = [
  {
    id: 'seed-habit-1',
    title: 'Morning Hydration',
    description: 'Drink 500ml water right after waking up',
    icon: 'water-outline',
    color: '#0284C7', // Sky Blue
    category: 'health',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    completedDates: [
      // 5-day active streak leading up to today
      (() => { const d = new Date(); d.setDate(d.getDate() - 4); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 3); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 2); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 1); return formatDateToKey(d); })(),
      getTodayKey(),
    ],
  },
  {
    id: 'seed-habit-2',
    title: 'Read 15 Pages',
    description: 'Non-fiction or personal development reading',
    icon: 'book-outline',
    color: '#8B5CF6', // Purple
    category: 'learning',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    completedDates: [
      (() => { const d = new Date(); d.setDate(d.getDate() - 3); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 2); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 1); return formatDateToKey(d); })(),
    ], // Not yet completed today (streak preserved from yesterday!)
  },
  {
    id: 'seed-habit-3',
    title: 'Daily Workout',
    description: '30 mins cardio or strength training',
    icon: 'barbell-outline',
    color: '#EF4444', // Red
    category: 'fitness',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    completedDates: [
      (() => { const d = new Date(); d.setDate(d.getDate() - 2); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 1); return formatDateToKey(d); })(),
    ],
  },
  {
    id: 'seed-habit-4',
    title: 'Mindful Meditation',
    description: '10 mins breath awareness',
    icon: 'leaf-outline',
    color: '#10B981', // Emerald
    category: 'mindfulness',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    completedDates: [
      (() => { const d = new Date(); d.setDate(d.getDate() - 5); return formatDateToKey(d); })(),
      (() => { const d = new Date(); d.setDate(d.getDate() - 4); return formatDateToKey(d); })(),
    ],
  },
];

export const loadHabitsFromStorage = async (): Promise<Habit[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First launch: initialize with sample habits
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_HABITS));
      return DEFAULT_SEED_HABITS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading habits from storage:', error);
    return DEFAULT_SEED_HABITS;
  }
};

export const saveHabitsToStorage = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits to storage:', error);
  }
};

export const toggleHabitCompletion = async (
  habitId: string,
  targetDate: string = getTodayKey()
): Promise<Habit[]> => {
  const habits = await loadHabitsFromStorage();
  const updatedHabits = habits.map((habit) => {
    if (habit.id !== habitId) return habit;

    const dates = new Set(habit.completedDates);
    if (dates.has(targetDate)) {
      dates.delete(targetDate);
    } else {
      dates.add(targetDate);
    }

    return {
      ...habit,
      completedDates: Array.from(dates),
    };
  });

  await saveHabitsToStorage(updatedHabits);
  return updatedHabits;
};

export const addHabitToStorage = async (
  newHabit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>
): Promise<Habit[]> => {
  const habits = await loadHabitsFromStorage();
  const habit: Habit = {
    ...newHabit,
    id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    completedDates: [],
  };

  const updatedHabits = [habit, ...habits];
  await saveHabitsToStorage(updatedHabits);
  return updatedHabits;
};

export const updateHabitInStorage = async (updated: Habit): Promise<Habit[]> => {
  const habits = await loadHabitsFromStorage();
  const updatedHabits = habits.map((h) => (h.id === updated.id ? updated : h));
  await saveHabitsToStorage(updatedHabits);
  return updatedHabits;
};

export const deleteHabitFromStorage = async (habitId: string): Promise<Habit[]> => {
  const habits = await loadHabitsFromStorage();
  const filtered = habits.filter((h) => h.id !== habitId);
  await saveHabitsToStorage(filtered);
  return filtered;
};
