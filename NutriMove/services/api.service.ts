import { API_URL } from '../utils/constants';

export const apiService = {
  // ========== AI NUTRITION ==========

  async getNutritionPlan(userData: {
    age: number;
    weight: number;
    height: number;
    gender: string;
    goal: string;
    activity_level: string;
  }) {
    try {
      const response = await fetch(`${API_URL}/ai/nutrition-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Nutrition plan error:', error);
      throw error;
    }
  },

  // ========== FOOD RECOGNITION ==========

  async recognizeFood(imageUri: string) {
    try {
      // React Native FormData with uri (no blob needed)
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'food.jpg',
      } as any);

      const response = await fetch(`${API_URL}/ai/recognize-food`, {
        method: 'POST',
        body: formData,
        // Let RN set the multipart boundary automatically
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Food recognition error:', error);
      throw error;
    }
  },

  // ========== NUTRITION LOGS ==========
  
  async addNutritionLog(log: {
    user_id: string;
    meal_type: string;
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    date: string;
  }) {
    const response = await fetch(`${API_URL}/nutrition-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    return response.json();
  },

  async getNutritionLogs(userId: string, date?: string) {
    const url = date 
      ? `${API_URL}/nutrition-logs/${userId}?date=${date}`
      : `${API_URL}/nutrition-logs/${userId}`;
    const response = await fetch(url);
    return response.json();
  },

  // ========== WORKOUTS ==========
  
  async addWorkout(workout: {
    user_id: string;
    name: string;
    type: string;
    duration: number;
    calories_burned: number;
    date: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    return response.json();
  },

  async getWorkouts(userId: string) {
    const response = await fetch(`${API_URL}/workouts/${userId}`);
    return response.json();
  },

  // ========== HEALTH CHECK ==========
  
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Backend not reachable:', error);
      return { status: 'offline' };
    }
  },
};