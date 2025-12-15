import { supabase } from './supabase';
import { UserProfile } from '../types/user.types';

export const userService = {
  createProfile: async (userId: string, profile: UserProfile) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profile,
      })
      .select()
      .single();
    return { data, error };
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};
