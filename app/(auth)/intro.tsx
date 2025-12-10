import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>FitLife</Text>
        <Text style={styles.subtitle}>
          Your Personal Fitness Journey Starts Here
        </Text>
        <View style={styles.features}>
          <Text style={styles.feature}>🏋️ Custom Workouts</Text>
          <Text style={styles.feature}>🥗 AI Nutrition Plans</Text>
          <Text style={styles.feature}>📅 Track Your Progress</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
       onPress={() => router.push('./signin')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.gray,
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  features: {
    gap: 16,
    alignItems: 'center',
  },
  feature: {
    fontSize: 18,
  },
  button: {
    backgroundColor: Colors.primaryGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});