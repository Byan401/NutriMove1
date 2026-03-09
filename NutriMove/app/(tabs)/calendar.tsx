import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { workoutService } from '../../services/workout.service';
import { nutritionService } from '../../services/nutrition.service';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function CalendarScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState<any>({});
  const [dayActivities, setDayActivities] = useState<any>({ workouts: [], meals: [] });
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    loadMonthData();
  }, [currentMonth, user]);

  useEffect(() => {
    loadDayActivities();
  }, [selectedDate, user]);

  const loadMonthData = async () => {
    if (!user) return;

    const start = format(startOfMonth(new Date(currentMonth)), 'yyyy-MM-dd');
    const end = format(endOfMonth(new Date(currentMonth)), 'yyyy-MM-dd');

    const { data: workouts } = await workoutService.getWorkoutsByDateRange(user.id, start, end);
    
    const marked: any = {};

    // Mark workout days
    workouts?.forEach((workout) => {
      const date = workout.date;
      if (!marked[date]) {
        marked[date] = { dots: [] };
      }
      marked[date].dots.push({
        key: workout.id,
        color: getWorkoutColor(workout.workout_type),
      });
    });

    // Mark selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: Colors.primary,
    };

    setMarkedDates(marked);
  };

  const loadDayActivities = async () => {
    if (!user) return;

    const { data: workouts } = await workoutService.getWorkoutsByDate(user.id, selectedDate);
    const { data: meals } = await nutritionService.getNutritionLogs(user.id, selectedDate);

    setDayActivities({
      workouts: workouts || [],
      meals: meals || [],
    });
  };

  const getWorkoutColor = (type: string) => {
    switch (type) {
      case 'upper_body':
        return Colors.upperBody;
      case 'lower_body':
        return Colors.lowerBody;
      case 'full_body':
        return Colors.fullBody;
      default:
        return Colors.primary;
    }
  };

  const getWorkoutTitle = (type: string) => {
    switch (type) {
      case 'upper_body':
        return 'Upper Body';
      case 'lower_body':
        return 'Lower Body';
      case 'full_body':
        return 'Full Body';
      default:
        return 'Workout';
    }
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const newMarked = { ...markedDates };
    
    // Remove previous selection
    Object.keys(newMarked).forEach((date) => {
      if (newMarked[date].selected) {
        delete newMarked[date].selected;
        delete newMarked[date].selectedColor;
      }
    });

    // Add new selection
    newMarked[day.dateString] = {
      ...newMarked[day.dateString],
      selected: true,
      selectedColor: Colors.primary,
    };

    setMarkedDates(newMarked);
  };

  const totalCalories = dayActivities.meals.reduce(
    (sum: number, meal: any) => sum + meal.calories,
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={onDayPress}
            onMonthChange={(month) => setCurrentMonth(month.dateString.substring(0, 7))}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.textSecondary,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.text,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.textMuted,
              monthTextColor: Colors.text,
              arrowColor: Colors.primary,
              textMonthFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
            }}
            style={styles.calendar}
          />
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.upperBody }]} />
            <Text style={styles.legendText}>Upper Body</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.lowerBody }]} />
            <Text style={styles.legendText}>Lower Body</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.fullBody }]} />
            <Text style={styles.legendText}>Full Body</Text>
          </View>
        </View>

        {/* Day Details */}
        <View style={styles.dayDetails}>
          <Text style={styles.dayTitle}>{format(new Date(selectedDate), 'MMMM d, yyyy')}</Text>

          {/* Workouts Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="barbell" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Workouts</Text>
            </View>

            {dayActivities.workouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No workouts logged</Text>
              </View>
            ) : (
              dayActivities.workouts.map((workout: any) => (
                <View key={workout.id} style={styles.activityCard}>
                  <View
                    style={[
                      styles.activityMarker,
                      { backgroundColor: getWorkoutColor(workout.workout_type) },
                    ]}
                  />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{getWorkoutTitle(workout.workout_type)}</Text>
                    <Text style={styles.activityDetails}>
                      {workout.completed_count} exercises • {workout.duration || 0} min
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Meals Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Nutrition</Text>
            </View>

            {dayActivities.meals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No meals logged</Text>
              </View>
            ) : (
              <>
                <View style={styles.nutritionSummary}>
                  <Text style={styles.totalCalories}>{Math.round(totalCalories)} kcal</Text>
                  <Text style={styles.totalLabel}>Total Calories</Text>
                </View>

                {dayActivities.meals.map((meal: any) => (
                  <View key={meal.id} style={styles.activityCard}>
                    <View style={[styles.activityMarker, { backgroundColor: Colors.success }]} />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{meal.meal_type}</Text>
                      <Text style={styles.activityDetails}>
                        {Math.round(meal.calories)} kcal • P: {Math.round(meal.protein)}g • C:{' '}
                        {Math.round(meal.carbs)}g • F: {Math.round(meal.fat)}g
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Weekly Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>This Week</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {dayActivities.workouts.length > 0 ? '🔥' : '💤'}
                </Text>
                <Text style={styles.summaryLabel}>
                  {dayActivities.workouts.length > 0 ? 'Active Day!' : 'Rest Day'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calendar: {
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dayDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityMarker: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  activityDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  nutritionSummary: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  totalCalories: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.8,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 36,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
