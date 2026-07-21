import { supabase } from './supabase';
import {
  DailyReport,
  DailyReportAnalysis,
  CalorieStats,
  FoodRecommendation,
  ReportConfig,
  DietQuality,
} from '../types/report.types';

// Activity multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Macro nutrients recommendations based on goals (in grams per 100 calories)
const MACRO_TARGETS = {
  lose_weight: { proteinRatio: 0.35, carbRatio: 0.35, fatRatio: 0.30 },
  gain_muscle: { proteinRatio: 0.30, carbRatio: 0.45, fatRatio: 0.25 },
  maintain: { proteinRatio: 0.25, carbRatio: 0.50, fatRatio: 0.25 },
};

/**
 * Calculate BMR using Mifflin-St Jeor Equation (most accurate for modern populations)
 * Women: BMR = 10W + 6.25H - 5A - 161
 * Men: BMR = 10W + 6.25H - 5A + 5
 * 
 * @param weight - weight in kg
 * @param height - height in cm
 * @param age - age in years
 * @param gender - 'male' or 'female'
 * @returns BMR in calories
 */
const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: string
): number => {
  if (gender.toLowerCase() === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure) from BMR and activity level
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - 'sedentary', 'light', 'moderate', 'active', 'very_active'
 * @returns TDEE in calories
 */
const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || 1.55;
  return bmr * multiplier;
};

/**
 * Calculate personalized calorie target based on user metrics and goal
 * @param weight - weight in kg
 * @param height - height in cm
 * @param age - age in years
 * @param gender - 'male' or 'female'
 * @param activityLevel - activity level for TDEE multiplier
 * @param goal - 'lose_weight', 'maintain', or 'gain_muscle'
 * @returns personalized calorie target
 */
const calculatePersonalizedCalorieTarget = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string
): number => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  // Apply goal-based adjustment
  if (goal === 'lose_weight') {
    return Math.round(tdee - 500); // 500 calorie deficit
  } else if (goal === 'gain_muscle') {
    return Math.round(tdee + 300); // 300 calorie surplus
  } else {
    return Math.round(tdee); // maintenance
  }
};

// Food recommendations based on user goal
const FOOD_RECOMMENDATIONS = {
  lose_weight: [
    { food: 'Chicken Breast', calories: 165, reason: 'High protein, low calories, keeps you full' },
    { food: 'Broccoli', calories: 34, reason: 'Very low calorie, high fiber' },
    { food: 'Egg Whites', calories: 17, reason: 'Pure protein, minimal calories' },
    { food: 'Greek Yogurt (0% fat)', calories: 59, reason: 'High protein, low calorie' },
    { food: 'Salmon', calories: 208, reason: 'Healthy fats, high protein, satiating' },
    { food: 'Sweet Potato', calories: 86, reason: 'Complex carbs, nutrient dense' },
  ],
  gain_muscle: [
    { food: 'Chicken Breast', calories: 165, reason: 'Excellent protein source for muscle growth' },
    { food: 'Rice', calories: 130, reason: 'Complex carbs for energy and muscle recovery' },
    { food: 'Eggs', calories: 155, reason: 'Complete amino acids, all macros' },
    { food: 'Salmon', calories: 208, reason: 'Protein + omega-3 for muscle growth' },
    { food: 'Peanut Butter', calories: 588, reason: 'Calorie dense, good fats and protein' },
    { food: 'Oats', calories: 389, reason: 'Complex carbs, sustained energy' },
  ],
  maintain: [
    { food: 'Lean Turkey', calories: 135, reason: 'Balanced nutrition' },
    { food: 'Quinoa', calories: 120, reason: 'Complete protein grain' },
    { food: 'Almonds', calories: 579, reason: 'Healthy fats and nutrients' },
    { food: 'Chickpeas', calories: 119, reason: 'Fiber and plant protein' },
    { food: 'Salmon', calories: 208, reason: 'Omega-3 and complete nutrition' },
    { food: 'Whole Wheat Bread', calories: 265, reason: 'Complex carbs with fiber' },
  ],
};

export const reportService = {
  /**
   * Calculate BMR using Mifflin-St Jeor Equation
   * For use when user metrics are available
   */
  calculateBMR,

  /**
   * Calculate TDEE from BMR and activity level
   */
  calculateTDEE,

  /**
   * Calculate personalized calorie target based on all user metrics
   * Uses Mifflin-St Jeor Equation for BMR calculation
   */
  calculatePersonalizedCalorieTarget,

  /**
   * Fallback: Calculate default calorie target based on user goal
   * This is used when user metrics are not available
   */
  calculateCalorieTarget: (goal: ReportConfig['userGoal']): number => {
    // Return generic targets as fallback when personalized metrics not available
    const fallbackTargets: { [key: string]: number } = {
      lose_weight: 2000,
      maintain: 2500,
      gain_muscle: 3000,
    };
    return fallbackTargets[goal] || 2500;
  },

  /**
   * Estimate calories burned from workouts
   * Uses basic formula: 5-7 calories per minute depending on intensity
   */
  estimateCaloriesBurned: (workoutData: any[]): number => {
    const caloriesPerMinute = 6; // Average for moderate intensity
    const totalDuration = workoutData.reduce((sum, w) => sum + (w.duration || 0), 0);
    return totalDuration * caloriesPerMinute;
  },

  /**
   * Analyze diet quality based on calorie intake vs target
   */
  analyzeDietQuality: (
    caloriesConsumed: number,
    caloriesTarget: number,
    caloriesBurned: number,
    goal: ReportConfig['userGoal']
  ): { quality: DietQuality; status: string; surplus: number } => {
    const calorieDifference = caloriesConsumed - caloriesTarget;
    const absoluteDifference = Math.abs(calorieDifference);
    const tolerancePercentage = 0.1; // 10% tolerance
    const tolerance = caloriesTarget * tolerancePercentage;

    let quality: DietQuality;
    let status: string;

    if (goal === 'lose_weight') {
      if (caloriesConsumed < caloriesTarget * 0.8) {
        quality = 'excellent';
        status = 'deficit';
      } else if (absoluteDifference <= tolerance) {
        quality = 'good';
        status = 'deficit';
      } else if (caloriesConsumed < caloriesTarget) {
        quality = 'adequate';
        status = 'deficit';
      } else {
        quality = 'poor';
        status = 'surplus';
      }
    } else if (goal === 'gain_muscle') {
      if (caloriesConsumed > caloriesTarget * 1.1) {
        quality = 'excellent';
        status = 'surplus';
      } else if (caloriesConsumed > caloriesTarget) {
        quality = 'good';
        status = 'surplus';
      } else if (absoluteDifference <= tolerance) {
        quality = 'adequate';
        status = 'balanced';
      } else {
        quality = 'poor';
        status = 'deficit';
      }
    } else {
      // maintain
      if (absoluteDifference <= tolerance) {
        quality = 'excellent';
        status = 'balanced';
      } else if (absoluteDifference <= tolerance * 1.5) {
        quality = 'good';
        status = 'balanced';
      } else if (caloriesConsumed < caloriesTarget * 0.95) {
        quality = 'adequate';
        status = 'deficit';
      } else {
        quality = 'adequate';
        status = 'surplus';
      }
    }

    return {
      quality,
      status,
      surplus: calorieDifference,
    };
  },

  /**
   * Generate analysis with feedback and suggestions
   */
  generateAnalysis: (
    caloriesConsumed: number,
    caloriesTarget: number,
    caloriesBurned: number,
    goal: ReportConfig['userGoal']
  ): DailyReportAnalysis => {
    const { quality, status, surplus } = reportService.analyzeDietQuality(
      caloriesConsumed,
      caloriesTarget,
      caloriesBurned,
      goal
    );

    let feedback = '';
    let urgencyLevel: 'low' | 'medium' | 'high';
    const isOnTrack = quality === 'excellent' || quality === 'good';

    if (goal === 'lose_weight') {
      if (quality === 'excellent') {
        feedback = `Great job! You're at a ${Math.abs(surplus)} calorie deficit. Perfect for steady weight loss! 💪`;
        urgencyLevel = 'low';
      } else if (quality === 'good') {
        feedback = `Nice! You're maintaining a moderate deficit of ${Math.abs(surplus)} calories. Keep it up! 👍`;
        urgencyLevel = 'low';
      } else if (quality === 'adequate') {
        feedback = `You have a small deficit of ${Math.abs(surplus)} calories. Try to increase it slightly. 🎯`;
        urgencyLevel = 'medium';
      } else {
        feedback = `Warning: You're at a ${surplus} calorie surplus. This won't support weight loss goals. Consider reducing intake. ⚠️`;
        urgencyLevel = 'high';
      }
    } else if (goal === 'gain_muscle') {
      if (quality === 'excellent') {
        feedback = `Excellent! You're at a ${surplus} calorie surplus ideal for muscle growth. Great nutrition day! 🏋️`;
        urgencyLevel = 'low';
      } else if (quality === 'good') {
        feedback = `Good! You have a ${surplus} calorie surplus for muscle building. Keep eating more! 🍗`;
        urgencyLevel = 'low';
      } else if (quality === 'adequate') {
        feedback = `You're close to maintenance. Try to increase intake to build muscle faster. 📈`;
        urgencyLevel = 'medium';
      } else {
        feedback = `Attention: You're in a deficit! You need more calories and protein for muscle growth. Eat more! 🍽️`;
        urgencyLevel = 'high';
      }
    } else {
      // maintain
      if (quality === 'excellent' || quality === 'good') {
        feedback = `Perfect! You're eating right to maintain your weight and health. 💚`;
        urgencyLevel = 'low';
      } else {
        feedback = `You're slightly off maintenance target. Try to balance your intake better. 🎯`;
        urgencyLevel = 'medium';
      }
    }

    // Get food recommendations
    const suggestions = reportService.getRecommendations(goal, caloriesConsumed, caloriesTarget, surplus);

    return {
      dietQuality: quality,
      dietStatus: status as any,
      isOnTrack,
      feedback,
      suggestions,
      urgencyLevel,
    };
  },

  /**
   * Get food recommendations based on user goal and current intake
   */
  getRecommendations: (
    goal: ReportConfig['userGoal'],
    consumed: number,
    target: number,
    surplus: number
  ): FoodRecommendation[] => {
    const recommendations = FOOD_RECOMMENDATIONS[goal];
    let relevantRecommendations = [...recommendations];

    // If user needs more calories (deficit for muscle gain or weight loss)
    if ((goal === 'gain_muscle' && consumed < target) || (goal === 'lose_weight' && consumed > target)) {
      // Sort by higher calories first
      relevantRecommendations = relevantRecommendations.sort((a, b) => b.calories - a.calories);
    }

    // If user needs fewer calories (surplus for weight loss)
    if (goal === 'lose_weight' && surplus > 0) {
      // Sort by lower calories first
      relevantRecommendations = relevantRecommendations.sort((a, b) => a.calories - b.calories);
    }

    // Return top 3 recommendations
    return relevantRecommendations.slice(0, 3).map((rec) => ({
      food: rec.food,
      calories: rec.calories,
      reason: rec.reason,
      goal,
    }));
  },

  /**
   * Fetch daily data from database and compile into DailyReport
   */
  generateDailyReport: async (userId: string, date: string, config: ReportConfig): Promise<DailyReport> => {
    try {
      // Fetch nutrition logs for the day
      const { data: nutritionLogs } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);

      // Fetch workouts for the day
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);

      // Calculate totals
      const caloriesConsumed = nutritionLogs?.reduce((sum: number, log: any) => sum + (log.calories || 0), 0) || 0;
      const caloriesBurned = reportService.estimateCaloriesBurned(workouts || []);
      const caloriesRemaining = config.targetCalories - caloriesConsumed;

      const nutritionTotals = nutritionLogs?.reduce(
        (acc: any, log: any) => ({
          protein: acc.protein + (log.protein || 0),
          carbs: acc.carbs + (log.carbs || 0),
          fat: acc.fat + (log.fat || 0),
        }),
        { protein: 0, carbs: 0, fat: 0 }
      ) || { protein: 0, carbs: 0, fat: 0 };

      const mealTotals = {
        breakfast: nutritionLogs?.filter((l: any) => l.meal_type === 'breakfast').reduce((s: number, l: any) => s + (l.calories || 0), 0) || 0,
        lunch: nutritionLogs?.filter((l: any) => l.meal_type === 'lunch').reduce((s: number, l: any) => s + (l.calories || 0), 0) || 0,
        dinner: nutritionLogs?.filter((l: any) => l.meal_type === 'dinner').reduce((s: number, l: any) => s + (l.calories || 0), 0) || 0,
        snacks: nutritionLogs?.filter((l: any) => l.meal_type === 'snack').reduce((s: number, l: any) => s + (l.calories || 0), 0) || 0,
      };

      const analysis = reportService.generateAnalysis(
        caloriesConsumed,
        config.targetCalories,
        caloriesBurned,
        config.userGoal
      );

      return {
        date,
        userId,
        calories: {
          consumed: caloriesConsumed,
          burned: caloriesBurned,
          target: config.targetCalories,
          remaining: Math.max(0, caloriesRemaining),
          surplus: caloriesRemaining,
        },
        nutrition: nutritionTotals,
        workouts: {
          count: workouts?.length || 0,
          totalDuration: workouts?.reduce((sum: number, w: any) => sum + (w.duration || 0), 0) || 0,
          totalCaloriesBurned: caloriesBurned,
        },
        meals: mealTotals,
        analysis,
      };
    } catch (error) {
      console.error('Error generating daily report:', error);
      throw error;
    }
  },
};
