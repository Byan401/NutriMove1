import { useState, useEffect, useCallback } from 'react';
import { DailyReport, ReportConfig } from '../types/report.types';
import { reportService } from '../services/report.service';
import { useAuth } from './useAuth';
import { userService } from '../services/user.service';

export const useDailyReport = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user profile and generate daily report
   */
  const loadDailyReport = useCallback(async () => {
    if (!user) {
      setReport(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await userService.getProfile(user.id);

      if (profileError || !profile) {
        throw new Error('Failed to load user profile');
      }

      // Calculate personalized calorie target using Mifflin-St Jeor equation
      // If all metrics are available, use personalized calculation
      let targetCalories: number;
      if (profile.weight && profile.height && profile.age && profile.gender) {
        const activityLevel = profile.activity_level || 'moderate';
        targetCalories = reportService.calculatePersonalizedCalorieTarget(
          profile.weight,
          profile.height,
          profile.age,
          profile.gender,
          activityLevel,
          profile.goal
        );
      } else {
        // Fallback to goal-based estimate if metrics missing
        targetCalories = reportService.calculateCalorieTarget(profile.goal);
      }

      // Create report config
      const config: ReportConfig = {
        userGoal: profile.goal,
        targetCalories,
        currentWeight: profile.weight,
        targetWeight: profile.target_weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
        activityLevel: profile.activity_level || 'moderate',
      };

      // Generate daily report
      const today = new Date().toISOString().split('T')[0];
      const dailyReport = await reportService.generateDailyReport(user.id, today, config);

      setReport(dailyReport);
    } catch (err: any) {
      console.error('Error loading daily report:', err);
      setError(err.message || 'Failed to load daily report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Load report on mount
   */
  useEffect(() => {
    loadDailyReport();
  }, [loadDailyReport]);

  /**
   * Refresh report (useful for real-time updates after logging meals/workouts)
   */
  const refreshReport = useCallback(async () => {
    await loadDailyReport();
  }, [loadDailyReport]);

  /**
   * Get report for specific date
   */
  const getReportForDate = useCallback(
    async (date: string) => {
      if (!user) return null;

      try {
        const { data: profile, error: profileError } = await userService.getProfile(user.id);

        if (profileError || !profile) {
          throw new Error('Failed to load user profile');
        }

        // Calculate personalized calorie target using Mifflin-St Jeor equation
        let targetCalories: number;
        if (profile.weight && profile.height && profile.age && profile.gender) {
          const activityLevel = profile.activity_level || 'moderate';
          targetCalories = reportService.calculatePersonalizedCalorieTarget(
            profile.weight,
            profile.height,
            profile.age,
            profile.gender,
            activityLevel,
            profile.goal
          );
        } else {
          targetCalories = reportService.calculateCalorieTarget(profile.goal);
        }

        const config: ReportConfig = {
          userGoal: profile.goal,
          targetCalories,
          currentWeight: profile.weight,
          targetWeight: profile.target_weight,
          height: profile.height,
          age: profile.age,
          gender: profile.gender,
          activityLevel: profile.activity_level || 'moderate',
        };

        const dateReport = await reportService.generateDailyReport(user.id, date, config);
        return dateReport;
      } catch (err: any) {
        console.error('Error loading report for date:', err);
        return null;
      }
    },
    [user]
  );

  return {
    report,
    loading,
    error,
    refreshReport,
    getReportForDate,
  };
};
