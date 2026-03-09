import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface Props {
  onTakePhoto: () => void;
  onPickImage: () => void;
  disabled?: boolean;
}

export default function FoodCamera({ onTakePhoto, onPickImage, disabled }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, styles.cameraBtn]}
        onPress={onTakePhoto}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {disabled ? (
          <ActivityIndicator size="small" color={Colors.text} />
        ) : (
          <Ionicons name="camera" size={28} color={Colors.text} />
        )}
        <Text style={styles.btnText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.galleryBtn]}
        onPress={onPickImage}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {disabled ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Ionicons name="images" size={28} color={Colors.primary} />
        )}
        <Text style={[styles.btnText, { color: Colors.primary }]}>Choose Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  cameraBtn: {
    backgroundColor: Colors.primary,
  },
  galleryBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
