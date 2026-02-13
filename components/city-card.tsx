import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  title: string;
  degree?: string;
  image: ImageSourcePropType;
  onPress?: () => void;
};

export default function CityCard({ title, degree, image, onPress }: Props) {
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#1b1d1f' }, 'background');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.card, { backgroundColor }]}>
      <Image source={image} style={styles.image} />
      <ThemedText type="defaultSemiBold" numberOfLines={1}>{title}</ThemedText>
      {degree ? <ThemedText type="default" style={styles.degree} numberOfLines={1}>{degree}</ThemedText> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(10,126,164,0.06)'
  },
  image: { width: 64, height: 64, borderRadius: 32, marginBottom: 8 },
  degree: { fontSize: 13, color: '#6b7280', marginTop: 4, textAlign: 'center' }
});
