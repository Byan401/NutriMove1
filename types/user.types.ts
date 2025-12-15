export interface User {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  goal: 'lose_weight' | 'gain_muscle' | 'maintain';
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
  target_weight?: number;
}