import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatHeaderDate } from '../utils/dateUtils';
import { OverallDailyStats } from '../types/habit';

interface HeaderStatsProps {
  stats: OverallDailyStats;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ stats }) => {
  const { totalHabits, completedTodayCount, completionPercentage, bestActiveStreak } = stats;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.dateText}>{formatHeaderDate()}</Text>
          <Text style={styles.heading}>Habits & Streaks</Text>
        </View>

        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={20} color="#F59E0B" />
          <View style={styles.streakInfo}>
            <Text style={styles.streakCount}>{bestActiveStreak}</Text>
            <Text style={styles.streakLabel}>BEST</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Goal</Text>
          <Text style={styles.progressRatio}>
            {completedTodayCount}/{totalHabits} ({completionPercentage}%)
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(completionPercentage, 100)}%` }]} />
        </View>

        <Text style={styles.motivationalMessage}>
          {totalHabits === 0
            ? 'No habits created yet. Tap + to begin!'
            : completionPercentage === 100
            ? '🎉 Flawless! All habits checked off for today.'
            : completionPercentage >= 50
            ? '🔥 Great momentum! Keep going!'
            : '🌱 Build the streak one habit at a time.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakInfo: {
    marginLeft: 6,
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B45309',
    lineHeight: 18,
  },
  streakLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  progressRatio: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  motivationalMessage: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
