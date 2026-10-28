import { HabitStreakStats } from '../types/habit';
import { getTodayKey, getYesterdayKey, getPastNDays, parseDateKey, formatDateToKey } from './dateUtils';

/**
 * Calculates current streak, longest streak, and 7-day status from completed dates array.
 */
export const calculateStreakStats = (completedDates: string[]): HabitStreakStats => {
  const datesSet = new Set(completedDates);
  const todayKey = getTodayKey();
  const yesterdayKey = getYesterdayKey();

  const isCompletedToday = datesSet.has(todayKey);
  const isCompletedYesterday = datesSet.has(yesterdayKey);

  // 1. Calculate Current Streak
  let currentStreak = 0;

  if (isCompletedToday || isCompletedYesterday) {
    // Start counting backwards
    let checkDate = new Date();
    if (!isCompletedToday) {
      // If not yet completed today, start checking from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (datesSet.has(formatDateToKey(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // 2. Calculate Longest Streak in History
  let longestStreak = 0;
  if (completedDates.length > 0) {
    // Sort unique dates ascending
    const sortedDates = Array.from(datesSet)
      .map(parseDateKey)
      .sort((a, b) => a.getTime() - b.getTime());

    let tempStreak = 0;
    let prevTime: number | null = null;
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    for (const dateObj of sortedDates) {
      const currentTime = dateObj.getTime();
      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currentTime - prevTime) / ONE_DAY_MS);
        if (diffDays === 1) {
          tempStreak += 1;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevTime = currentTime;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // 3. Last 7 Days Status (Past 7 days including today)
  const past7 = getPastNDays(7);
  const last7DaysStatus = past7.map((day) => ({
    date: day.date,
    dayLabel: day.dayLabel,
    completed: datesSet.has(day.date),
    isToday: day.isToday,
  }));

  return {
    currentStreak,
    longestStreak,
    totalCompletions: completedDates.length,
    isCompletedToday,
    isCompletedYesterday,
    last7DaysStatus,
  };
};
