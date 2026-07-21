import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DailyReport } from '../../types/report.types';
import { Colors } from '../../constants/Colors';
import { ProgressBar } from '../shared/ProgressBar';

interface DailyReportCardProps {
  report: DailyReport | null;
  loading?: boolean;
}

/**
 * Main component for displaying Daily Report
 * Shows calorie stats, nutrition summary, and AI-generated feedback
 */
export const DailyReportCard: React.FC<DailyReportCardProps> = ({ report, loading = false }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No data available yet</Text>
      </View>
    );
  }

  const urgencyColor =
    report.analysis.urgencyLevel === 'high'
      ? Colors.error
      : report.analysis.urgencyLevel === 'medium'
        ? Colors.warning
        : Colors.success;

  const qualityColor =
    report.analysis.dietQuality === 'excellent'
      ? Colors.success
      : report.analysis.dietQuality === 'good'
        ? Colors.accent
        : report.analysis.dietQuality === 'adequate'
          ? Colors.warning
          : Colors.error;

  return (
    <View style={styles.container}>
      {/* Header with date and status */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Report</Text>
          <Text style={styles.date}>{new Date(report.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: qualityColor + '20', borderColor: qualityColor }]}>
          <Text style={[styles.badgeText, { color: qualityColor }]}>{report.analysis.dietQuality.toUpperCase()}</Text>
        </View>
      </View>

      {/* Calorie Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Calorie Summary</Text>

        <View style={styles.calorieStats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Consumed</Text>
            <Text style={styles.statValue}>{report.calories.consumed}</Text>
            <Text style={styles.statUnit}>kcal</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Target</Text>
            <Text style={styles.statValue}>{report.calories.target}</Text>
            <Text style={styles.statUnit}>kcal</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Burned</Text>
            <Text style={styles.statValue}>{report.calories.burned}</Text>
            <Text style={styles.statUnit}>kcal</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <ProgressBar
            current={report.calories.consumed}
            target={report.calories.target}
            label="Daily Progress"
            unit="kcal"
            maxValue={report.calories.target * 1.2}
          />
        </View>

        {/* Remaining Calories */}
        <View style={[styles.remainingBox, { backgroundColor: Colors.backgroundLight }]}>
          <Text style={styles.remainingLabel}>
            {report.calories.surplus > 0 ? 'Calories Remaining' : 'Calorie Surplus'}
          </Text>
          <Text style={[styles.remainingValue, { color: report.calories.surplus > 0 ? Colors.warning : Colors.accent }]}>
            {Math.abs(report.calories.surplus)} kcal
          </Text>
        </View>
      </View>

      {/* Macronutrients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥗 Macronutrients</Text>

        <View style={styles.macroRow}>
          <View style={styles.macroCard}>
            <View style={[styles.macroCircle, { backgroundColor: Colors.info + '20' }]}>
              <Text style={[styles.macroValue, { color: Colors.info }]}>P</Text>
            </View>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroNumber}>{report.nutrition.protein.toFixed(0)}g</Text>
          </View>

          <View style={styles.macroCard}>
            <View style={[styles.macroCircle, { backgroundColor: Colors.warning + '20' }]}>
              <Text style={[styles.macroValue, { color: Colors.warning }]}>C</Text>
            </View>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroNumber}>{report.nutrition.carbs.toFixed(0)}g</Text>
          </View>

          <View style={styles.macroCard}>
            <View style={[styles.macroCircle, { backgroundColor: Colors.success + '20' }]}>
              <Text style={[styles.macroValue, { color: Colors.success }]}>F</Text>
            </View>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroNumber}>{report.nutrition.fat.toFixed(0)}g</Text>
          </View>
        </View>
      </View>

      {/* AI Feedback and Suggestions */}
      <View style={[styles.section, styles.feedbackSection]}>
        <Text style={styles.sectionTitle}>💡 AI Feedback</Text>

        <View style={[styles.feedbackBox, { borderLeftColor: urgencyColor }]}>
          <Text style={styles.feedbackText}>{report.analysis.feedback}</Text>
        </View>

        {/* Recommendations */}
        {report.analysis.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Recommended Foods:</Text>
            {report.analysis.suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <View style={styles.suggestionBullet} />
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionFood}>{suggestion.food}</Text>
                  <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
                  <Text style={styles.suggestionCalories}>{suggestion.calories} cal/serving</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Meal Breakdown */}
      {(report.meals.breakfast > 0 ||
        report.meals.lunch > 0 ||
        report.meals.dinner > 0 ||
        report.meals.snacks > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Meal Breakdown</Text>

          <View style={styles.mealGrid}>
            {report.meals.breakfast > 0 && (
              <View style={styles.mealItem}>
                <Text style={styles.mealLabel}>Breakfast</Text>
                <Text style={styles.mealCalories}>{report.meals.breakfast}</Text>
              </View>
            )}
            {report.meals.lunch > 0 && (
              <View style={styles.mealItem}>
                <Text style={styles.mealLabel}>Lunch</Text>
                <Text style={styles.mealCalories}>{report.meals.lunch}</Text>
              </View>
            )}
            {report.meals.dinner > 0 && (
              <View style={styles.mealItem}>
                <Text style={styles.mealLabel}>Dinner</Text>
                <Text style={styles.mealCalories}>{report.meals.dinner}</Text>
              </View>
            )}
            {report.meals.snacks > 0 && (
              <View style={styles.mealItem}>
                <Text style={styles.mealLabel}>Snacks</Text>
                <Text style={styles.mealCalories}>{report.meals.snacks}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  calorieStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: 4,
  },
  statUnit: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  progressSection: {
    marginVertical: 12,
  },
  remainingBox: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  remainingLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  remainingValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  macroCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  macroCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  macroNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  feedbackSection: {
    backgroundColor: Colors.backgroundLight,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: -20,
    marginVertical: 0,
    paddingVertical: 14,
    marginBottom: 20,
  },
  feedbackBox: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: 12,
    gap: 10,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  suggestionBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
    marginTop: 6,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionFood: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  suggestionReason: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },
  suggestionCalories: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
