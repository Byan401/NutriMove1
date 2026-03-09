import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { workoutService } from '../../services/workout.service';

const WORKOUT_SECTIONS = [
  {
    type: 'upper_body' as const,
    title: 'Upper Body',
    icon: 'fitness',
    color: Colors.upperBody,
    exercises: ['Chest Press', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips', 'Pull-ups', 'Rows'],
  },
  {
    type: 'lower_body' as const,
    title: 'Lower Body',
    icon: 'walk',
    color: Colors.lowerBody,
    exercises: ['Squats', 'Lunges', 'Deadlifts', 'Leg Press', 'Calf Raises', 'Leg Curls'],
  },
  {
    type: 'full_body' as const,
    title: 'Full Body',
    icon: 'body',
    color: Colors.fullBody,
    exercises: ['Burpees', 'Mountain Climbers', 'Planks', 'Jumping Jacks', 'Push-ups', 'Box Jumps'],
  },
];

export default function Workout() {
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savingWorkout, setSavingWorkout] = useState(false);

  const toggleSection = (type: string) => {
    setExpandedSection(expandedSection === type ? null : type);
  };

  const toggleExercise = (sectionType: string, exercise: string) => {
    const key = `${sectionType}-${exercise}`;
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveWorkout = async (sectionType: string) => {
    if (!user) return;

    setSavingWorkout(true);
    const section = WORKOUT_SECTIONS.find((s) => s.type === sectionType);
    if (!section) return;

    const completed = section.exercises.filter(
      (ex) => completedExercises[`${sectionType}-${ex}`]
    ).length;

    await workoutService.addWorkout({
      user_id: user.id,
      workout_type: section.type,
      completed_count: completed,
      date: new Date().toISOString().split('T')[0],
      duration: 45,
    });

    setSavingWorkout(false);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);

    // Clear checkboxes
    section.exercises.forEach((ex) => {
      const key = `${sectionType}-${ex}`;
      setCompletedExercises((prev) => ({ ...prev, [key]: false }));
    });
  };

  const getCompletedCount = (sectionType: string) => {
    const section = WORKOUT_SECTIONS.find((s) => s.type === sectionType);
    if (!section) return 0;
    return section.exercises.filter((ex) => completedExercises[`${sectionType}-${ex}`]).length;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Tracker</Text>
          <Text style={styles.subtitle}>Choose your workout type and track your progress</Text>
        </View>

        {WORKOUT_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.type;
          const completedCount = getCompletedCount(section.type);

          return (
            <View key={section.type} style={styles.section}>
              <TouchableOpacity
                style={[styles.sectionHeader, { borderLeftColor: section.color }]}
                onPress={() => toggleSection(section.type)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                    <Ionicons name={section.icon as any} size={28} color={section.color} />
                  </View>
                  <View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.exerciseCount}>
                      {section.exercises.length} exercises
                      {completedCount > 0 && ` • ${completedCount} completed`}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.exerciseList}>
                  {section.exercises.map((exercise) => {
                    const key = `${section.type}-${exercise}`;
                    const isChecked = completedExercises[key] || false;

                    return (
                      <TouchableOpacity
                        key={exercise}
                        style={styles.exerciseItem}
                        onPress={() => toggleExercise(section.type, exercise)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isChecked && { backgroundColor: section.color },
                          ]}
                        >
                          {isChecked && (
                            <Ionicons name="checkmark" size={18} color={Colors.text} />
                          )}
                        </View>
                        <Text style={[styles.exerciseName, isChecked && styles.exerciseCompleted]}>
                          {exercise}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {completedCount > 0 && (
                    <TouchableOpacity
                      style={[styles.saveButton, { backgroundColor: section.color }]}
                      onPress={() => saveWorkout(section.type)}
                      disabled={savingWorkout}
                    >
                      <Ionicons name="checkmark-circle" size={20} color={Colors.text} />
                      <Text style={styles.saveButtonText}>
                        {savingWorkout ? 'Saving...' : 'Save Workout'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Success Modal */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.successText}>Workout Saved!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderLeftWidth: 4,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  exerciseList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  exerciseCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
});