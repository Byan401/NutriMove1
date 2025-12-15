import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={100} color={Colors.textMuted} />
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>This screen doesn't exist.</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="home" size={20} color={Colors.text} />
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 30,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
