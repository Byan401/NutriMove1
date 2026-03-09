import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { useNutrition } from '../../hooks/useNutrition';
import AIAnalysisResult from '../../components/nutrition/AIAnalysisResult';
import FoodCamera from '../../components/nutrition/FoodCamera';
import NutritionCard from '../../components/nutrition/NutritionCard';

export default function Nutrition() {
  const {
    analyzing,
    lastResult,
    error,
    dailyNutrition,
    recentLogs,
    loading,
    analyzeFood,
    saveMeal,
    dismissResult,
    refresh,
  } = useNutrition();

  const [saving, setSaving] = useState(false);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      try {
        await analyzeFood(result.assets[0].uri);
      } catch {
        Alert.alert('Error', 'Could not analyze this image. Make sure your backend is running.');
      }
    }
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      try {
        await analyzeFood(result.assets[0].uri);
      } catch {
        Alert.alert('Error', 'Could not analyze this image. Make sure your backend is running.');
      }
    }
  };

  const handleSave = async (mealType: string) => {
    setSaving(true);
    try {
      await saveMeal(mealType);
      Alert.alert('Saved!', 'Meal logged successfully');
    } catch {
      Alert.alert('Error', 'Failed to save meal');
    } finally {
      setSaving(false);
    }
  };

  const totalMacros = dailyNutrition.protein + dailyNutrition.carbs + dailyNutrition.fat;
  const getMacroPercent = (v: number) => (totalMacros > 0 ? (v / totalMacros) * 100 : 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Tracker</Text>
        <Text style={styles.subtitle}>Track your meals with AI</Text>
      </View>

      {/* Daily Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Nutrition</Text>

        <View style={styles.calorieSection}>
          <Text style={styles.calorieValue}>{Math.round(dailyNutrition.calories)}</Text>
          <Text style={styles.calorieLabel}>Calories</Text>
        </View>

        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <View style={[styles.macroBar, { backgroundColor: Colors.upperBody + '30' }]}>
              <View style={[styles.macroFill, { width: `${getMacroPercent(dailyNutrition.protein)}%`, backgroundColor: Colors.upperBody }]} />
            </View>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{Math.round(dailyNutrition.protein)}g</Text>
          </View>

          <View style={styles.macroItem}>
            <View style={[styles.macroBar, { backgroundColor: Colors.lowerBody + '30' }]}>
              <View style={[styles.macroFill, { width: `${getMacroPercent(dailyNutrition.carbs)}%`, backgroundColor: Colors.lowerBody }]} />
            </View>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{Math.round(dailyNutrition.carbs)}g</Text>
          </View>

          <View style={styles.macroItem}>
            <View style={[styles.macroBar, { backgroundColor: Colors.fullBody + '30' }]}>
              <View style={[styles.macroFill, { width: `${getMacroPercent(dailyNutrition.fat)}%`, backgroundColor: Colors.fullBody }]} />
            </View>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{Math.round(dailyNutrition.fat)}g</Text>
          </View>
        </View>
      </View>

      {/* Camera Buttons */}
      <FoodCamera onTakePhoto={takePhoto} onPickImage={pickImage} disabled={analyzing} />

      {/* Analyzing spinner */}
      {analyzing && (
        <View style={styles.analyzingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.analyzingText}>Analyzing your food...</Text>
        </View>
      )}

      {/* Error message */}
      {error && !analyzing && !lastResult && (
        <View style={[styles.analyzingCard, { borderColor: Colors.error }]}>
          <Ionicons name="alert-circle" size={32} color={Colors.error} />
          <Text style={[styles.analyzingText, { color: Colors.error }]}>{error}</Text>
        </View>
      )}

      {/* AI Result Card */}
      {lastResult && (
        <AIAnalysisResult
          result={lastResult}
          onSave={handleSave}
          onDismiss={dismissResult}
          saving={saving}
        />
      )}

      {/* Recent Logs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 16 }} />
        ) : recentLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No meals logged yet</Text>
            <Text style={styles.emptySubtext}>Take a photo of your food to get started</Text>
          </View>
        ) : (
          recentLogs.map((log, index) => (
            <NutritionCard
              key={log.id || index}
              food_name={log.food_name || log.meal_type}
              calories={log.calories}
              protein={log.protein}
              carbs={log.carbs}
              fat={log.fats || log.fat || 0}
              meal_type={log.meal_type}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  calorieLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  macrosContainer: {
    gap: 16,
  },
  macroItem: {
    gap: 8,
  },
  macroBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  analyzingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  analyzingText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});