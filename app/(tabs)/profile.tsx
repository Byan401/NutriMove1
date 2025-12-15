// app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user.service';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data } = await userService.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await signOut();
          if (!error) {
            router.replace('./sign-in');
          }
        },
      },
    ]);
  };

  const getGoalText = () => {
    if (!profile?.goal) return 'Not Set';
    switch (profile.goal) {
      case 'lose_weight':
        return 'Lose Weight';
      case 'gain_muscle':
        return 'Gain Muscle';
      case 'maintain':
        return 'Maintain Weight';
      default:
        return 'Not Set';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="body" size={32} color={Colors.primary} />
          <Text style={styles.statValue}>{profile?.weight || 0} kg</Text>
          <Text style={styles.statLabel}>Current Weight</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="resize" size={32} color={Colors.primary} />
          <Text style={styles.statValue}>{profile?.height || 0} cm</Text>
          <Text style={styles.statLabel}>Height</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy" size={32} color={Colors.primary} />
          <Text style={styles.statValue}>{profile?.target_weight || 0} kg</Text>
          <Text style={styles.statLabel}>Target Weight</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flag" size={32} color={Colors.primary} />
          <Text style={styles.statValue}>{profile?.age || 0}</Text>
          <Text style={styles.statLabel}>Age</Text>
        </View>
      </View>

      {/* Goal Card */}
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Your Goal</Text>
        <View style={styles.goalContent}>
          <Ionicons name="locate" size={28} color={Colors.primary} />
          <Text style={styles.goalText}>{getGoalText()}</Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Ionicons name="person" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.text,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  goalCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  version: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});