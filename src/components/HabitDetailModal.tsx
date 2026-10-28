import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types/habit';
import { calculateStreakStats } from '../utils/streakCalculator';

interface HabitDetailModalProps {
  habit: Habit | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
  habit,
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!habit) return null;

  const stats = calculateStreakStats(habit.completedDates);

  const confirmDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"? Your streak history for this habit will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(habit.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Close X */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>

          {/* Hero Icon */}
          <View style={[styles.iconCircle, { backgroundColor: `${habit.color}15` }]}>
            <Ionicons name={habit.icon as any || 'star-outline'} size={36} color={habit.color} />
          </View>

          {/* Title & Category */}
          <Text style={styles.title}>{habit.title}</Text>
          {habit.description ? (
            <Text style={styles.description}>{habit.description}</Text>
          ) : null}

          {/* Stat Cards Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={22} color="#F59E0B" />
              <Text style={styles.statNum}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="trophy" size={22} color="#10B981" />
              <Text style={styles.statNum}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="checkmark-done-circle" size={22} color="#6366F1" />
              <Text style={styles.statNum}>{stats.totalCompletions}</Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                onClose();
                onEdit(habit);
              }}
            >
              <Ionicons name="create-outline" size={18} color="#111827" />
              <Text style={styles.editBtnText}>Edit Habit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 16,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
    gap: 10,
  },
  editBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
