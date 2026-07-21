import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ProgressBarProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  showLabel?: boolean;
  color?: string;
  height?: number;
  animated?: boolean;
  maxValue?: number; // For determining percentage
}

/**
 * Reusable ProgressBar component with visual feedback
 * Shows current vs target values with color coding
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  unit = '',
  showLabel = true,
  color,
  height = 8,
  animated = false,
  maxValue,
}) => {
  // Calculate percentage
  const percentage = maxValue ? (current / maxValue) * 100 : (current / target) * 100;
  const displayPercentage = Math.min(Math.round(percentage), 100);

  // Determine color based on percentage if not specified
  let barColor = color;
  if (!barColor) {
    if (displayPercentage >= 100) {
      barColor = Colors.success;
    } else if (displayPercentage >= 80) {
      barColor = Colors.accent;
    } else if (displayPercentage >= 50) {
      barColor = Colors.warning;
    } else {
      barColor = Colors.error;
    }
  }

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {current.toFixed(0)}/{target.toFixed(0)} {unit}
          </Text>
        </View>
      )}
      <View style={[styles.barContainer, { height }]}>
        <View
          style={[
            styles.bar,
            {
              width: `${displayPercentage}%`,
              backgroundColor: barColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  value: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  barContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bar: {
    borderRadius: 4,
  },
});
