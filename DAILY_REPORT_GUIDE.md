# Daily Report System - Implementation Guide

## Overview
The Daily Report System is a smart dashboard feature that analyzes user nutrition and workout data to provide:
- Real-time calorie tracking (consumed vs target vs burned)
- Macronutrient breakdown (protein, carbs, fats)
- AI-powered feedback based on user goals
- Personalized food recommendations
- Visual progress indicators with color coding

---

## Architecture

### 1. **Types** (`types/report.types.ts`)
Defines the data structures for the report system:

```typescript
- CalorieStats: Contains consumed, burned, target, remaining, surplus
- DailyReportAnalysis: AI analysis with feedback, suggestions, urgency level
- DailyReport: Complete daily snapshot with all metrics
- ReportConfig: User configuration (goal, target calories, weight)
```

### 2. **Service** (`services/report.service.ts`)
Core business logic for calculations and recommendations:

**Key Functions:**
- `calculateCalorieTarget()`: Determines daily calorie target based on goal
- `estimateCaloriesBurned()`: Calculates calories from workouts
- `analyzeDietQuality()`: Evaluates diet against goals
- `generateAnalysis()`: Creates AI feedback and suggestions
- `getRecommendations()`: Provides 3 personalized food suggestions
- `generateDailyReport()`: Main function that fetches data and compiles report

**Calorie Targets by Goal:**
- `lose_weight`: 2000 kcal/day (conservative deficit)
- `maintain`: 2500 kcal/day
- `gain_muscle`: 3000 kcal/day (surplus for gains)

### 3. **Components**

#### ProgressBar Component (`components/shared/ProgressBar.tsx`)
- Displays progress with visual bar
- Auto-colors: Green (100%+), Teal (80%), Orange (50%), Red (<50%)
- Shows current/target values with percentage

#### DailyReportCard Component (`components/nutrition/DailyReport.tsx`)
- Main UI component displaying the complete report
- Sections:
  - Header with date and quality badge
  - Calorie summary with progress bar
  - Macronutrient breakdown
  - AI feedback section with urgency indicator
  - Food recommendations
  - Meal breakdown by type

### 4. **Hook** (`hooks/useDailyReport.ts`)
React hook for managing daily report state:

```typescript
const { report, loading, error, refreshReport, getReportForDate } = useDailyReport();
```

**Features:**
- Auto-loads report on mount
- Provides manual refresh function
- Supports fetching specific date's report
- Handles user profile loading and error states

---

## Integration with Home Page

The Daily Report is integrated into the home page (`app/(tabs)/home.tsx`):

```typescript
import { useDailyReport } from '../../hooks/useDailyReport';
import { DailyReportCard } from '../../components/nutrition/DailyReport';

export default function HomeScreen() {
  const { report, loading, refreshReport } = useDailyReport();
  
  // Pull-to-refresh functionality
  const onRefresh = async () => {
    await refreshReport();
  };
  
  return (
    <ScrollView refreshControl={...}>
      {/* Header */}
      {/* Daily Report */}
      <DailyReportCard report={report} loading={loading} />
      {/* Quick Actions */}
    </ScrollView>
  );
}
```

**Real-time Updates:**
- Report refreshes when screen comes into focus (`useFocusEffect`)
- Pull-to-refresh support
- Manual refresh after logging meals/workouts

---

## Analysis Logic

### Diet Quality Evaluation

**For Weight Loss Goal:**
- **Excellent**: <80% of target (strong deficit)
- **Good**: Within deficit tolerance (80-100%)
- **Adequate**: Small deficit
- **Poor**: At or above calorie target (no deficit)

**For Muscle Gain Goal:**
- **Excellent**: >110% of target (good surplus)
- **Good**: Above target (surplus)
- **Adequate**: Close to target
- **Poor**: Below target (deficit)

**For Maintenance Goal:**
- **Excellent**: Very close to target (±5%)
- **Good**: Close to target (±7.5%)
- **Adequate**: Slightly off (±10%)

### AI Feedback Messages
- Contextual messages based on goal and performance
- Urgency levels: `low` (on track), `medium` (slightly off), `high` (needs attention)
- Emoji indicators for quick visual scanning

### Personalized Recommendations
- Top 3 foods suggested based on:
  - User's goal (weight loss, muscle gain, maintenance)
  - Current calorie deficit/surplus
  - Nutritional needs

**Example:**
- Weight loss: Focus on low-calorie, high-protein foods
- Muscle gain: Focus on calorie-dense, protein-rich foods
- Maintenance: Balanced nutrition

---

## Usage Examples

### Displaying the Report
```typescript
import { useDailyReport } from '@/hooks/useDailyReport';
import { DailyReportCard } from '@/components/nutrition/DailyReport';

export function Dashboard() {
  const { report, loading } = useDailyReport();
  
  return <DailyReportCard report={report} loading={loading} />;
}
```

### Refreshing After User Action
```typescript
const handleMealLogged = async () => {
  // Log meal to database...
  await refreshReport(); // Re-fetch and display updated report
};
```

### Getting Report for Specific Date
```typescript
const { getReportForDate } = useDailyReport();

const yesterdayReport = await getReportForDate('2026-04-15');
```

---

## Database Requirements

Ensure your Supabase has these tables:

### `nutrition_logs`
```sql
- id: UUID
- user_id: UUID
- image_url: TEXT
- meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
- calories: INT
- protein: DECIMAL
- carbs: DECIMAL
- fat: DECIMAL
- ai_advice: TEXT
- date: DATE
- created_at: TIMESTAMP
```

### `workouts`
```sql
- id: UUID
- user_id: UUID
- workout_type: 'upper_body' | 'lower_body' | 'full_body'
- completed_count: INT
- duration: INT (minutes)
- date: DATE
- created_at: TIMESTAMP
```

### `profiles`
```sql
- id: UUID
- full_name: TEXT
- age: INT
- gender: TEXT
- height: INT (cm)
- weight: INT (kg)
- goal: 'lose_weight' | 'gain_muscle' | 'maintain'
- target_weight: INT (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## Customization Options

### Adjust Calorie Targets
Edit `reportService.CALORIE_TARGETS`:
```typescript
const CALORIE_TARGETS = {
  lose_weight: 1800,  // Lower for faster loss
  maintain: 2500,
  gain_muscle: 3200,  // Higher for more gains
};
```

### Modify Macro Ratios
Edit `reportService.MACRO_TARGETS` to balance protein/carbs/fats.

### Add/Remove Food Recommendations
Edit `reportService.FOOD_RECOMMENDATIONS` by goal.

### Customize Colors
Update urgency colors in `DailyReportCard`:
```typescript
const urgencyColor = report.analysis.urgencyLevel === 'high' 
  ? Colors.error : Colors.warning;
```

---

## Testing Checklist

- [ ] Report loads on home page
- [ ] Data displays correctly (consumed, target, burned calories)
- [ ] Progress bar updates with calorie data
- [ ] Quality badge shows correct rating
- [ ] AI feedback is contextual to goal
- [ ] Food recommendations match user goal
- [ ] Pull-to-refresh updates report
- [ ] No performance issues with large data sets
- [ ] Error handling works (no profile, no data)
- [ ] Meal breakdown section only shows non-zero meals
- [ ] Color indicators work correctly
- [ ] Real-time updates after logging meals/workouts

---

## Performance Considerations

1. **Data Fetching**: The service fetches nutrition logs and workouts for today only
2. **Caching**: Consider caching user profile to avoid repeated fetches
3. **Optimization**: Use `useFocusEffect` to refresh only when needed
4. **Database Indexes**: Add indexes on `user_id` and `date` columns for faster queries

---

## Future Enhancements

- [ ] Multi-day streak tracking
- [ ] Historical comparison (week/month trends)
- [ ] Custom calorie target input
- [ ] Weekly report summary
- [ ] Notification system for streak/goals
- [ ] Export report as PDF
- [ ] Share achievements on social media

---

## Files Created/Modified

### New Files
- `types/report.types.ts` - Type definitions
- `services/report.service.ts` - Business logic
- `hooks/useDailyReport.ts` - React hook
- `components/nutrition/DailyReport.tsx` - Main component
- `components/shared/ProgressBar.tsx` - Visual component

### Modified Files
- `app/(tabs)/home.tsx` - Integrated DailyReport

---

## Troubleshooting

**Report showing "No data available yet"**
- Check if user has logged meals/workouts for today
- Verify database connection and user profile exists

**Incorrect calorie calculations**
- Verify nutrition_logs in database have correct calorie values
- Check if workouts have duration set

**Colors not showing**
- Ensure Colors theme is imported correctly
- Check if Colors.success, Colors.error are defined

**Real-time updates not working**
- Check useFocusEffect dependency array
- Verify refreshReport is called properly
- Test pull-to-refresh functionality

---

## Summary

This comprehensive Daily Report system transforms the home page into an intelligent fitness dashboard that:
✅ Tracks daily progress in real-time
✅ Provides AI-powered feedback personalized to user goals
✅ Gives actionable food recommendations
✅ Uses visual indicators for quick understanding
✅ Updates automatically when user logs activities
✅ Scales easily for future enhancements
