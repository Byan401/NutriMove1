export interface CalorieStats {
  consumed: number;
  burned: number;
  target: number;
  remaining: number;
  surplus: number; // positive = surplus, negative = deficit
}

export interface FoodRecommendation {
  food: string;
  calories: number;
  reason: string;
  goal: string; // aligned with user goal
}

export type DietQuality = 'excellent' | 'good' | 'adequate' | 'poor';
type DietStatus = 'surplus' | 'deficit' | 'balanced';

export interface DailyReportAnalysis {
  dietQuality: DietQuality;
  dietStatus: DietStatus;
  isOnTrack: boolean;
  feedback: string;
  suggestions: FoodRecommendation[];
  urgencyLevel: 'low' | 'medium' | 'high'; // low = on track, medium = slightly off, high = needs attention
}

export interface DailyReport {
  date: string;
  userId: string;
  calories: CalorieStats;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
  };
  workouts: {
    count: number;
    totalDuration: number;
    totalCaloriesBurned: number;
  };
  meals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  analysis: DailyReportAnalysis;
}

export interface ReportConfig {
  userGoal: 'lose_weight' | 'gain_muscle' | 'maintain';
  targetCalories: number;
  currentWeight: number;
  targetWeight?: number;
  // User metrics for personalized Mifflin-St Jeor calculation
  height?: number; // cm
  age?: number; // years
  gender?: string; // 'male' or 'female'
  activityLevel?: string; // 'sedentary', 'light', 'moderate', 'active', 'very_active'
}
