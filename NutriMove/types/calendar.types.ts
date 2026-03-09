import type { Workout } from './workout.types';
import type { NutritionLog } from './nutrition.types';

export interface CalendarDay {
  date: string;
  workouts: Workout[];
  meals: NutritionLog[];
  hasActivity: boolean;
}

export interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  };
}