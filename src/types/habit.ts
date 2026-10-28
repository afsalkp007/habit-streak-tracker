export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'learning' 
  | 'mindfulness' 
  | 'productivity' 
  | 'lifestyle';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  category: HabitCategory;
  createdAt: string;
  completedDates: string[]; // Set of YYYY-MM-DD strings
  archived?: boolean;
}

export interface HabitStreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  isCompletedToday: boolean;
  isCompletedYesterday: boolean;
  last7DaysStatus: {
    date: string;
    dayLabel: string;
    completed: boolean;
    isToday: boolean;
  }[];
}

export interface OverallDailyStats {
  totalHabits: number;
  completedTodayCount: number;
  completionPercentage: number;
  bestActiveStreak: number;
  totalCompletionsAllTime: number;
}

export type HabitFilter = 'all' | 'pending' | 'completed';
