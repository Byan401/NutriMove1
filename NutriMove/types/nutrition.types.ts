export interface NutritionLog {
  id: string;
  user_id: string;
  image_url: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ai_advice: string;
  date: string;
  created_at: string;
}

export interface NutritionAnalysis {
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  advice: string;
}