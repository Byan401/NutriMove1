import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface Props {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
}

export default function NutritionCard({ food_name, calories, protein, carbs, fat, meal_type }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.mealIcon}>
          <Ionicons
            name={
              meal_type === 'breakfast'
                ? 'sunny-outline'
                : meal_type === 'lunch'
                ? 'restaurant-outline'
                : meal_type === 'dinner'
                ? 'moon-outline'
                : 'cafe-outline'
            }
            size={20}
            color={Colors.primary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.foodName}>{food_name}</Text>
          <Text style={styles.mealType}>{meal_type}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.calories}>{Math.round(calories)}</Text>
        <Text style={styles.kcalLabel}>kcal</Text>
        <Text style={styles.macros}>
          P:{Math.round(protein)}g  C:{Math.round(carbs)}g  F:{Math.round(fat)}g
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  mealType: {
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  kcalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  macros: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
