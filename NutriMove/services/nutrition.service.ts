import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';

export const nutritionService = {
  uploadImage: async (userId: string, imageUri: string) => {
    const fileExt = imageUri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: `image/${fileExt}`,
      name: fileName,
    } as any);

    const { data, error } = await supabase.storage
      .from('nutrition-images')
      .upload(filePath, formData);

    if (error) return { data: null, error };

    const { data: { publicUrl } } = supabase.storage
      .from('nutrition-images')
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  },

  analyzeFood: async (imageUrl: string, userId: string, userGoal: string, mealType: string) => {
    const { data, error } = await supabase.functions.invoke('analyze-nutrition', {
      body: {
        imageUrl,
        userId,
        userGoal,
        mealType,
      },
    });
    return { data, error };
  },

  getNutritionLogs: async (userId: string, date: string) => {
    const { data, error } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getDailyNutrition: async (userId: string, date: string) => {
    const { data, error } = await supabase
      .from('nutrition_logs')
      .select('calories, protein, carbs, fat')
      .eq('user_id', userId)
      .eq('date', date);

    if (error || !data) return { data: null, error };

    const totals = data.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return { data: totals, error: null };
  },
};