export interface Workout {
  id: string;
  user_id: string;
  workout_type: 'upper_body' | 'lower_body' | 'full_body';
  completed_count: number;
  date: string;
  duration?: number;
  notes?: string;
  created_at: string;
}

export interface WorkoutSection {
  type: 'upper_body' | 'lower_body' | 'full_body';
  title: string;
  exercises: string[];
  color: string;
}