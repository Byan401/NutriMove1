import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import type { FoodResult } from '../../hooks/useNutrition';

interface Props {
  result: FoodResult;
  onSave: (mealType: string) => void;
  onDismiss: () => void;
  saving?: boolean;
}

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' as const },
  { key: 'lunch', label: 'Lunch', icon: 'restaurant-outline' as const },
  { key: 'dinner', label: 'Dinner', icon: 'moon-outline' as const },
  { key: 'snack', label: 'Snack', icon: 'cafe-outline' as const },
];

export default function AIAnalysisResult({ result, onSave, onDismiss, saving }: Props) {
  const confidencePercent = Math.round(result.confidence_score * 100);
  const confidenceColor =
    confidencePercent >= 70 ? Colors.success : confidencePercent >= 40 ? Colors.warning : Colors.error;

  return (
    <View style={styles.container}>
      {/* Header with dismiss */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Analysis Result</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Food image */}
      {result.imageUri && (
        <Image source={{ uri: result.imageUri }} style={styles.image} />
      )}

      {/* Food name + confidence */}
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{result.food_name}</Text>
        <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor + '20' }]}>
          <Ionicons name="analytics" size={14} color={confidenceColor} />
          <Text style={[styles.confidenceText, { color: confidenceColor }]}>
            {confidencePercent}% confident
          </Text>
        </View>
      </View>

      {/* Nutrition grid */}
      <View style={styles.nutritionGrid}>
        <NutrientBox label="Calories" value={`${Math.round(result.nutrition.calories)}`} unit="kcal" color={Colors.warning} />
        <NutrientBox label="Protein" value={`${Math.round(result.nutrition.protein)}`} unit="g" color={Colors.upperBody} />
        <NutrientBox label="Carbs" value={`${Math.round(result.nutrition.carbs)}`} unit="g" color={Colors.lowerBody} />
        <NutrientBox label="Fat" value={`${Math.round(result.nutrition.fat)}`} unit="g" color={Colors.fullBody} />
      </View>

      {result.nutrition.serving && (
        <Text style={styles.serving}>Serving: {result.nutrition.serving}</Text>
      )}

      {/* Meal type selector */}
      <Text style={styles.saveLabel}>Save as:</Text>
      <View style={styles.mealTypes}>
        {MEAL_TYPES.map((meal) => (
          <TouchableOpacity
            key={meal.key}
            style={styles.mealBtn}
            onPress={() => onSave(meal.key)}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <Ionicons name={meal.icon} size={20} color={Colors.primary} />
                <Text style={styles.mealBtnText}>{meal.label}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function NutrientBox({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <View style={styles.nutrientBox}>
      <View style={[styles.nutrientDot, { backgroundColor: color }]} />
      <Text style={styles.nutrientValue}>
        {value}
        <Text style={styles.nutrientUnit}> {unit}</Text>
      </Text>
      <Text style={styles.nutrientLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeBtn: {
    padding: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  foodInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  nutrientBox: {
    alignItems: 'center',
    gap: 4,
  },
  nutrientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nutrientValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  nutrientUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: Colors.textSecondary,
  },
  nutrientLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  serving: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  saveLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  mealTypes: {
    flexDirection: 'row',
    gap: 10,
  },
  mealBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  mealBtnText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
});
