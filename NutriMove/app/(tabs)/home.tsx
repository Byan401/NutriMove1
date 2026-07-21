/*import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, User! 👋</Text>
        <Text style={styles.subtitle}>Ready to crush your goals today?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1,247</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>8,432</Text>
          <Text style={styles.statLabel}>Steps</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./workout')}
        >
          <Text style={styles.actionIcon}>🏋️</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Start Workout</Text>
            <Text style={styles.actionSubtitle}>Begin your training session</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./nutrition')}
        >
          <Text style={styles.actionIcon}>🥗</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>AI Nutrition</Text>
            <Text style={styles.actionSubtitle}>Get personalized meal plans</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./calendar')}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>View Calendar</Text>
            <Text style={styles.actionSubtitle}>Track your progress</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60, // مسافة من الأعلى للـ safe area
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.softGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryGreen,
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24, // مسافة من الأسفل
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
});
*/
// app/(tabs)/home.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user.service';
import { Colors } from '../../constants/Colors';
import { DailyReportCard } from '../../components/nutrition/DailyReport';
import { useDailyReport } from '../../hooks/useDailyReport';

export default function HomeScreen() {
  const router = useRouter();
  const { report, loading, refreshReport } = useDailyReport();
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await userService.getProfile(user.id);
      if (mounted && data) {
        setProfileName(data.full_name || null);
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, [user]);

  // Refresh report when screen is focused (for real-time updates)
  useFocusEffect(
    useCallback(() => {
      refreshReport();
    }, [refreshReport])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshReport();
    setRefreshing(false);
  }, [refreshReport]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Hello, {profileName ?? user?.email?.split('@')[0] ?? 'User'}!
        </Text>
        <Text style={styles.subtitle}>Ready to crush your goals today?</Text>
      </View>

      {/* Daily Report Section */}
      <DailyReportCard report={report} loading={loading} />

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/workout')}
        >
          <Text style={styles.actionIcon}>🏋️</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Start Workout</Text>
            <Text style={styles.actionSubtitle}>Begin your training session</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/nutrition')}
        >
          <Text style={styles.actionIcon}>🥗</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>AI Nutrition</Text>
            <Text style={styles.actionSubtitle}>Get personalized meal plans</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/calendar')}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>View Calendar</Text>
            <Text style={styles.actionSubtitle}>Track your progress</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});