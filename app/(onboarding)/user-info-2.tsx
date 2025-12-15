import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const GOALS = [
  {
    id: 'lose_weight',
    title: 'Lose Weight',
    icon: 'trending-down',
    description: 'Burn fat and slim down',
  },
  {
    id: 'gain_muscle',
    title: 'Gain Muscle',
    icon: 'fitness',
    description: 'Build strength and size',
  },
  {
    id: 'maintain',
    title: 'Stay Healthy',
    icon: 'heart',
    description: 'Maintain current fitness',
  },
];

export default function UserInfo2() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  const handleFinish = async () => {
    // Save user profile to Supabase here
    // For now, just navigate to home
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={styles.subtitle}>Choose your primary fitness objective</Text>
      </View>

      <View style={styles.goalsContainer}>
        {GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              selectedGoal === goal.id && styles.goalCardActive,
            ]}
            onPress={() => setSelectedGoal(goal.id)}
          >
            <View
              style={[
                styles.iconContainer,
                selectedGoal === goal.id && styles.iconContainerActive,
              ]}
            >
              <Ionicons
                name={goal.icon as any}
                size={32}
                color={selectedGoal === goal.id ? Colors.text : Colors.primary}
              />
            </View>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedGoal && (
        <View style={styles.targetSection}>
          <Text style={styles.label}>Target Weight (optional)</Text>
          <View style={styles.targetInput}>
            <Text style={styles.targetValue}>{targetWeight || '0'}</Text>
            <Text style={styles.targetUnit}>kg</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, !selectedGoal && styles.buttonDisabled]}
        onPress={handleFinish}
        disabled={!selectedGoal}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  goalsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  goalCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconContainerActive: {
    backgroundColor: Colors.primary,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  targetSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  targetInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  targetValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  targetUnit: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});