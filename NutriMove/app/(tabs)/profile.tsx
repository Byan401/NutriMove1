import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user.service';
import { UserProfile } from '../../types/user.types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await userService.getProfile(user.id);
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
          setForm({
            full_name: data?.full_name ?? '',
            age: data?.age?.toString() ?? '',
            gender: data?.gender ?? '',
            height: data?.height?.toString() ?? '',
            weight: data?.weight?.toString() ?? '',
            goal: data?.goal ?? '',
          });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View>
          {/* Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.full_name ? getInitials(profile.full_name) : 'U'}
              </Text>
            </View>
            <Text style={styles.profileName}>
              {profile?.full_name || 'User'}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email || 'No email'}
            </Text>
          </View>

          {/* User Info */}
          {profile && (
            <View style={styles.userInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>{profile.age} years</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoValue}>{profile.gender}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Height:</Text>
                <Text style={styles.infoValue}>{profile.height} cm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{profile.weight} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Goal:</Text>
                <Text style={styles.infoValue}>{profile.goal}</Text>
              </View>
            </View>
          )}

          {/* Stats removed per request */}

          {/* Menu */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
            {/* Edit form modal/inline */}
            {isEditing && (
              <View style={styles.editContainer}>
                <Text style={styles.editTitle}>Edit Profile</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  value={form.full_name}
                  onChangeText={text => setForm(s => ({ ...s, full_name: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={form.age}
                  onChangeText={text => setForm(s => ({ ...s, age: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Gender"
                  value={form.gender}
                  onChangeText={text => setForm(s => ({ ...s, gender: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Height (cm)"
                  keyboardType="numeric"
                  value={form.height}
                  onChangeText={text => setForm(s => ({ ...s, height: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Weight (kg)"
                  keyboardType="numeric"
                  value={form.weight}
                  onChangeText={text => setForm(s => ({ ...s, weight: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Goal"
                  value={form.goal}
                  onChangeText={text => setForm(s => ({ ...s, goal: text }))}
                />

                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.saveButton]}
                    onPress={async () => {
                      if (!user) return;
                      const updates = {
                        full_name: form.full_name,
                        age: form.age ? parseInt(form.age, 10) : null,
                        gender: form.gender,
                        height: form.height ? parseFloat(form.height) : null,
                        weight: form.weight ? parseFloat(form.weight) : null,
                        goal: form.goal,
                      } as any;
                      const { data, error } = await userService.updateProfile(user.id, updates);
                      if (error) {
                        Alert.alert('Error', 'Could not update profile.');
                        console.error(error);
                      } else {
                        setProfile(data);
                        setIsEditing(false);
                      }
                    }}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cancelButton]}
                    onPress={() => {
                      setIsEditing(false);
                      if (profile) {
                        setForm({
                          full_name: profile.full_name ?? '',
                          age: profile.age?.toString() ?? '',
                          gender: profile.gender ?? '',
                          height: profile.height?.toString() ?? '',
                          weight: profile.weight?.toString() ?? '',
                          goal: profile.goal ?? '',
                        });
                      }
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },

  /* Header */
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
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
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  /* User Info */
  userInfo: {
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },

  /* Stats */
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 32,
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  profileStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  /* Menu */
  menuSection: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
  },

  /* Loading */
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  editContainer: {
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: Colors.backgroundLight,
    color: Colors.text,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  saveText: {
    color: Colors.text,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
