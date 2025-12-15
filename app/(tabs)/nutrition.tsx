import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { nutritionService } from '../../services/nutrition.service';
import { userService } from '../../services/user.service';

export default function Nutrition() {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [userGoal, setUserGoal] = useState('maintain');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const { data: profile } = await userService.getProfile(user.id);
    setUserGoal(profile?.goal || 'maintain');

    const today = new Date().toISOString().split('T')[0];
    const { data: nutrition } = await nutritionService.getDailyNutrition(user.id, today);
    if (nutrition) setDailyNutrition(nutrition);

    const { data: logs } = await nutritionService.getNutritionLogs(user.id, today);
    if (logs) setRecentLogs(logs);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && user) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && user) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    if (!user) return;

    setAnalyzing(true);
    try {
      // Upload image
      const { data: imageUrl, error: uploadError } = await nutritionService.uploadImage(
        user.id,
        imageUri
      );

      if (uploadError || !imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Analyze with AI
      const { data: analysis, error: analysisError } = await nutritionService.analyzeFood(
        imageUrl,
        user.id,
        userGoal,
        'snack'
      );

      if (analysisError) {
        throw new Error('Failed to analyze food');
      }

      Alert.alert('Success!', 'Your meal has been logged');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to analyze food');
    } finally {
      setAnalyzing(false);
    }
  };

  const getMacroPercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const totalMacros = dailyNutrition.protein + dailyNutrition.carbs + dailyNutrition.fat;

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
            <View style={[styles.macroBar, { backgroundColor: Colors.upperBody }]}>
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${getMacroPercentage(dailyNutrition.protein, totalMacros)}%`,
                    backgroundColor: Colors.upperBody,
                  },
                ]}
              />
            </View>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{Math.round(dailyNutrition.protein)}g</Text>
          </View>

          <View style={styles.macroItem}>
            <View style={[styles.macroBar, { backgroundColor: Colors.lowerBody }]}>
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${getMacroPercentage(dailyNutrition.carbs, totalMacros)}%`,
                    backgroundColor: Colors.lowerBody,
                  },
                ]}
              />
            </View>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{Math.round(dailyNutrition.carbs)}g</Text>
          </View>

          <View style={styles.macroItem}>
            <View style={[styles.macroBar, { backgroundColor: Colors.fullBody }]}>
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${getMacroPercentage(dailyNutrition.fat, totalMacros)}%`,
                    backgroundColor: Colors.fullBody,
                  },
                ]}
              />
            </View>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{Math.round(dailyNutrition.fat)}g</Text>
          </View>
        </View>
      </View>

      {/* Camera Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={takePhoto}
          disabled={analyzing}
        >
          <Ionicons name="camera" size={28} color={Colors.text} />
          <Text style={styles.actionButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={pickImage}
          disabled={analyzing}
        >
          <Ionicons name="images" size={28} color={Colors.primary} />
          <Text style={[styles.actionButtonText, { color: Colors.primary }]}>
            Choose Photo
          </Text>
        </TouchableOpacity>
      </View>

      {analyzing && (
        <View style={styles.analyzingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.analyzingText}>Analyzing your food...</Text>
        </View>
      )}

      {/* Recent Logs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        {recentLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No meals logged yet</Text>
            <Text style={styles.emptySubtext}>Take a photo of your food to get started</Text>
          </View>
        ) : (
          recentLogs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <Image source={{ uri: log.image_url }} style={styles.logImage} />
              <View style={styles.logContent}>
                <Text style={styles.logMealType}>{log.meal_type}</Text>
                <Text style={styles.logCalories}>{Math.round(log.calories)} kcal</Text>
                <Text style={styles.logMacros}>
                  P: {Math.round(log.protein)}g • C: {Math.round(log.carbs)}g • F:{' '}
                  {Math.round(log.fat)}g
                </Text>
              </View>
            </View>
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
    opacity: 0.3,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
  },
  secondaryAction: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionButtonText: {
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
  logCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  logContent: {
    flex: 1,
    justifyContent: 'center',
  },
  logMealType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  logCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  logMacros: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});