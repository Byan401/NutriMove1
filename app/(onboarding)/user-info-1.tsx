import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function UserInfo1() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    // Store data temporarily (you can use AsyncStorage or context)
    router.push('/(onboarding)/user-info-2');
  };

  const selectGender = (selected: string) => {
    setGender(selected);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>This helps us personalize your experience</Text>
        </View>

        <View style={styles.form}>
          {/* Gender Selection */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => selectGender('male')}
            >
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => selectGender('female')}
            >
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
              onPress={() => selectGender('other')}
            >
              <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statInput}>
              <Text style={styles.label}>Age</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>{age || '0'}</Text>
                <Text style={styles.inputUnit}>years</Text>
              </View>
            </View>

            <View style={styles.statInput}>
              <Text style={styles.label}>Height</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>{height || '0'}</Text>
                <Text style={styles.inputUnit}>cm</Text>
              </View>
            </View>

            <View style={styles.statInput}>
              <Text style={styles.label}>Weight</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>{weight || '0'}</Text>
                <Text style={styles.inputUnit}>kg</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  genderTextActive: {
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statInput: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  inputUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});