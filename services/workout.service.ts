import { supabase } from './supabase';
import { Workout } from '../types/workout.types';

export const workoutService = {
  addWorkout: async (workout: Omit<Workout, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single();
    return { data, error };
  },

  getWorkoutsByDate: async (userId: string, date: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date);
    return { data, error };
  },

  getWorkoutsByDateRange: async (userId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  updateWorkout: async (id: string, updates: Partial<Workout>) => {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deleteWorkout: async (id: string) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    return { error };
  },
};