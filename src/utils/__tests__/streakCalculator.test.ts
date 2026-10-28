import assert from 'node:assert';
import test from 'node:test';
import { calculateStreakStats } from '../streakCalculator';
import { getTodayKey, getYesterdayKey, formatDateToKey } from '../dateUtils';

test('streakCalculator - returns 0 streak for empty completions', () => {
  const stats = calculateStreakStats([]);
  assert.strictEqual(stats.currentStreak, 0);
  assert.strictEqual(stats.longestStreak, 0);
  assert.strictEqual(stats.totalCompletions, 0);
  assert.strictEqual(stats.isCompletedToday, false);
});

test('streakCalculator - correctly recognizes today completion as 1 streak', () => {
  const today = getTodayKey();
  const stats = calculateStreakStats([today]);
  assert.strictEqual(stats.currentStreak, 1);
  assert.strictEqual(stats.longestStreak, 1);
  assert.strictEqual(stats.isCompletedToday, true);
});

test('streakCalculator - preserves streak if completed yesterday but not today yet', () => {
  const yesterday = getYesterdayKey();
  const twoDaysAgo = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return formatDateToKey(d);
  })();

  const stats = calculateStreakStats([twoDaysAgo, yesterday]);
  assert.strictEqual(stats.currentStreak, 2);
  assert.strictEqual(stats.isCompletedToday, false);
  assert.strictEqual(stats.isCompletedYesterday, true);
});

test('streakCalculator - increments streak when consecutive days are checked', () => {
  const d3 = (() => { const d = new Date(); d.setDate(d.getDate() - 2); return formatDateToKey(d); })();
  const d2 = getYesterdayKey();
  const d1 = getTodayKey();

  const stats = calculateStreakStats([d3, d2, d1]);
  assert.strictEqual(stats.currentStreak, 3);
  assert.strictEqual(stats.longestStreak, 3);
  assert.strictEqual(stats.isCompletedToday, true);
});

test('streakCalculator - computes past 7 days status array', () => {
  const today = getTodayKey();
  const stats = calculateStreakStats([today]);
  assert.strictEqual(stats.last7DaysStatus.length, 7);
  const todayItem = stats.last7DaysStatus.find(s => s.isToday);
  assert.ok(todayItem);
  assert.strictEqual(todayItem.completed, true);
});
