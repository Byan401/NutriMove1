import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api.service';
import { useAuth } from './useAuth';

export interface FoodResult {
  food_name: string;
  confidence: string;
  confidence_score: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving?: string;
    note?: string;
  };
  imageUri?: string;
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const useNutrition = () => {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDailyData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiService.getNutritionLogs(user.id, today);

      if (response.logs) {
        setRecentLogs(response.logs);
      }
      if (response.summary) {
        setDailyNutrition({
          calories: response.summary.calories || 0,
          protein: response.summary.protein || 0,
          carbs: response.summary.carbs || 0,
          fat: response.summary.fats || 0,
        });
      }
    } catch (e) {
      console.error('Failed to load daily data:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDailyData();
  }, [loadDailyData]);

  const analyzeFood = useCallback(async (imageUri: string) => {
    setAnalyzing(true);
    setError(null);
    setLastResult(null);

    try {
      const result = await apiService.recognizeFood(imageUri);

      if (!result.success) {
        throw new Error(result.error || 'Recognition failed');
      }

      const foodResult: FoodResult = {
        food_name: result.food_name,
        confidence: result.confidence,
        confidence_score: result.confidence_score,
        nutrition: result.nutrition,
        imageUri,
      };

      setLastResult(foodResult);
      return foodResult;
    } catch (e: any) {
      const msg = e.message || 'Failed to analyze food';
      setError(msg);
      throw e;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const saveMeal = useCallback(async (mealType: string) => {
    if (!user || !lastResult) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await apiService.addNutritionLog({
        user_id: user.id,
        meal_type: mealType,
        food_name: lastResult.food_name,
        calories: lastResult.nutrition.calories,
        protein: lastResult.nutrition.protein,
        carbs: lastResult.nutrition.carbs,
        fats: lastResult.nutrition.fat,
        date: today,
      });

      setLastResult(null);
      await loadDailyData();
    } catch (e: any) {
      setError(e.message || 'Failed to save meal');
      throw e;
    }
  }, [user, lastResult, loadDailyData]);

  const dismissResult = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return {
    analyzing,
    lastResult,
    error,
    dailyNutrition,
    recentLogs,
    loading,
    analyzeFood,
    saveMeal,
    dismissResult,
    refresh: loadDailyData,
  };
};
