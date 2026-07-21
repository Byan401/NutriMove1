export interface User {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  goal: 'lose_weight' | 'gain_muscle' | 'maintain';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'; // For Mifflin-St Jeor TDEE calculation
  target_weight?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  full_name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activity_level?: string; // For Mifflin-St Jeor TDEE calculation
  target_weight?: number;
}