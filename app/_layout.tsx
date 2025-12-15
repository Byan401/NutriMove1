/*import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // Redirect to sign-in if not authenticated
      router.replace('../(auth)/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and in auth screens
      router.replace('/(tabs)/home');
    }
  }, [user, segments, loading]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.backgroundLight,
          },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(onboarding)" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}*/
import { Slot } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <Slot />
    </View>
  );
}