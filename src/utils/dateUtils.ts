/**
 * Date utility helpers for Habit Streak Tracker
 * Formats dates consistently in YYYY-MM-DD local time.
 */

export const formatDateToKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayKey = (): string => {
  return formatDateToKey(new Date());
};

export const getYesterdayKey = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateToKey(d);
};

export const getPastNDays = (count: number = 7): { date: string; dayLabel: string; isToday: boolean }[] => {
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const result: { date: string; dayLabel: string; isToday: boolean }[] = [];
  const todayKey = getTodayKey();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatDateToKey(d);
    result.push({
      date: key,
      dayLabel: dayLabels[d.getDay()],
      isToday: key === todayKey,
    });
  }

  return result;
};

export const formatHeaderDate = (date: Date = new Date()): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString(undefined, options);
};

export const parseDateKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};
