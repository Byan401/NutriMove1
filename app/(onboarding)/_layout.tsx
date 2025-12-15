/*import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function OnboardingLayout() {
  return (
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
        name="user-info-1" 
        options={{ 
          title: 'Personal Info',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="user-info-2" 
        options={{ 
          title: 'Your Goals',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}*/
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function OnboardingLayout() {
  return (
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
        name="user-info-1" 
        options={{ 
          title: 'Personal Info',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="user-info-2" 
        options={{ 
          title: 'Your Goals',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}