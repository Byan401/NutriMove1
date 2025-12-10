import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: any) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{ ...workout, user_id: user?.id }]);

      if (error) throw error;
      await fetchWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  };

  return { workouts, loading, refetch: fetchWorkouts, addWorkout };
}

// Remove the RootLayout component and Stack import from this hooks file.