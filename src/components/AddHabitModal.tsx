import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit, HabitCategory } from '../types/habit';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habitData: {
    title: string;
    description: string;
    icon: string;
    color: string;
    category: HabitCategory;
  }) => void;
  editingHabit?: Habit | null;
}

const AVAILABLE_COLORS = [
  '#0284C7', // Sky Blue
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#0D9488', // Teal
  '#6366F1', // Indigo
];

const AVAILABLE_ICONS = [
  'water-outline',
  'barbell-outline',
  'book-outline',
  'leaf-outline',
  'heart-outline',
  'bicycle-outline',
  'walk-outline',
  'bed-outline',
  'cafe-outline',
  'code-slash-outline',
  'musical-notes-outline',
  'sunny-outline',
];

const CATEGORIES: { label: string; value: HabitCategory }[] = [
  { label: 'Health', value: 'health' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Learning', value: 'learning' },
  { label: 'Mindfulness', value: 'mindfulness' },
  { label: 'Productivity', value: 'productivity' },
  { label: 'Lifestyle', value: 'lifestyle' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(AVAILABLE_COLORS[0]);
  const [icon, setIcon] = useState(AVAILABLE_ICONS[0]);
  const [category, setCategory] = useState<HabitCategory>('health');

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description || '');
      setColor(editingHabit.color);
      setIcon(editingHabit.icon);
      setCategory(editingHabit.category);
    } else {
      resetForm();
    }
  }, [editingHabit, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setColor(AVAILABLE_COLORS[0]);
    setIcon(AVAILABLE_ICONS[0]);
    setCategory('health');
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a habit title.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      icon,
      color,
      category,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editingHabit ? 'Edit Habit' : 'New Habit'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <Text style={styles.label}>HABIT NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 20 mins, Drink 2L water"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={40}
            />

            {/* Description Input */}
            <Text style={styles.label}>MOTIVATION / NOTE (OPTIONAL)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="e.g. For mental clarity and better focus"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              maxLength={100}
            />

            {/* Category */}
            <Text style={styles.label}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryPill,
                    category === cat.value && styles.categoryPillActive,
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      category === cat.value && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Color Picker */}
            <Text style={styles.label}>COLOR THEME</Text>
            <View style={styles.paletteRow}>
              {AVAILABLE_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    color === c && styles.colorDotSelected,
                  ]}
                  onPress={() => setColor(c)}
                >
                  {color === c && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Icon Picker */}
            <Text style={styles.label}>ICON</Text>
            <View style={styles.iconGrid}>
              {AVAILABLE_ICONS.map((i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.iconBox,
                    icon === i && { borderColor: color, backgroundColor: `${color}15` },
                  ]}
                  onPress={() => setIcon(i)}
                >
                  <Ionicons
                    name={i as any}
                    size={24}
                    color={icon === i ? color : '#6B7280'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: color }]} onPress={handleSave}>
              <Text style={styles.saveBtnText}>
                {editingHabit ? 'Save Changes' : 'Create Habit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  inputMultiline: {
    height: 60,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#111827',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 4,
    marginBottom: 24,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
