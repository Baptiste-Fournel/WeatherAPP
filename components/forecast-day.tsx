import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { iconForCode } from '@/utils/weather';

type Props = {
    date: string;
    temp_max: number;
    temp_min: number;
    weathercode: number;
};

export default function ForecastDay({ date, temp_max, temp_min, weathercode }: Props) {
    const icon = iconForCode(weathercode);
    const dayName = new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' });

    return (
        <View style={styles.card}>
            <ThemedText type="defaultSemiBold" style={styles.dayName}>{dayName}</ThemedText>
            <Image source={icon} style={styles.icon} />
            <ThemedText type="default" style={styles.temp}>
                {Math.round(temp_max)}° / {Math.round(temp_min)}°
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { width: 110, borderRadius: 12, padding: 12, marginRight: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
    dayName: { fontSize: 13, marginBottom: 6 },
    icon: { width: 48, height: 48, marginBottom: 6 },
    temp: { fontSize: 13, color: '#6b7280' },
});
