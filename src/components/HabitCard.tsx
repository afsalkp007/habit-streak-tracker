import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Habit } from '../types/habit';
import { calculateStreakStats } from '../utils/streakCalculator';

interface HabitCardProps {
  habit: Habit;
  onToggleToday: (id: string) => void;
  onPressCard: (habit: Habit) => void;
  onLongPressCard: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleToday,
  onPressCard,
  onLongPressCard,
}) => {
  const stats = calculateStreakStats(habit.completedDates);
  const { currentStreak, isCompletedToday, last7DaysStatus } = stats;

  const handleToggle = () => {
    try {
      Haptics.impactAsync(
        isCompletedToday
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    } catch {
      // Haptics fallback if on web or unsupported
    }
    onToggleToday(habit.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompletedToday && styles.cardCompleted,
      ]}
      onPress={() => onPressCard(habit)}
      onLongPress={() => onLongPressCard(habit)}
      activeOpacity={0.8}
    >
      <View style={styles.mainRow}>
        {/* Category Icon */}
        <View style={[styles.iconWrapper, { backgroundColor: `${habit.color}15` }]}>
          <Ionicons
            name={habit.icon as any || 'star-outline'}
            size={24}
            color={habit.color}
          />
        </View>

        {/* Title, Description & Streak */}
        <View style={styles.infoCol}>
          <Text
            style={[
              styles.title,
              isCompletedToday && styles.titleCompleted,
            ]}
            numberOfLines={1}
          >
            {habit.title}
          </Text>

          {habit.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {habit.description}
            </Text>
          ) : null}

          <View style={styles.streakRow}>
            <Ionicons
              name="flame"
              size={14}
              color={currentStreak > 0 ? '#F59E0B' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.streakText,
                currentStreak > 0 ? styles.streakActive : styles.streakInactive,
              ]}
            >
              {currentStreak === 1
                ? '1 day streak'
                : `${currentStreak} days streak`}
            </Text>
          </View>
        </View>

        {/* Checkmark Action Button */}
        <TouchableOpacity
          style={[
            styles.checkButton,
            isCompletedToday
              ? { backgroundColor: habit.color, borderColor: habit.color }
              : styles.checkButtonPending,
          ]}
          onPress={handleToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isCompletedToday ? (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          ) : (
            <View style={styles.checkCirclePlaceholder} />
          )}
        </TouchableOpacity>
      </View>

      {/* 7-Day History Mini Strip */}
      <View style={styles.weekStrip}>
        {last7DaysStatus.map((day) => (
          <View key={day.date} style={styles.dayCol}>
            <Text
              style={[
                styles.dayLabel,
                day.isToday && styles.dayLabelToday,
              ]}
            >
              {day.dayLabel}
            </Text>
            <View
              style={[
                styles.dayDot,
                day.completed
                  ? { backgroundColor: habit.color }
                  : styles.dayDotEmpty,
                day.isToday && !day.completed && styles.dayDotTodayPending,
              ]}
            >
              {day.completed && (
                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
              )}
            </View>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompleted: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  titleCompleted: {
    color: '#6B7280',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  streakActive: {
    color: '#D97706',
  },
  streakInactive: {
    color: '#9CA3AF',
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonPending: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  checkCirclePlaceholder: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dayCol: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dayLabelToday: {
    color: '#111827',
    fontWeight: '700',
  },
  dayDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotEmpty: {
    backgroundColor: '#F3F4F6',
  },
  dayDotTodayPending: {
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    backgroundColor: 'transparent',
  },
});
