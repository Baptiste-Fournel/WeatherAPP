import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import ForecastDay from '@/components/forecast-day';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { iconForCode } from '@/utils/weather';
import { getCityLocation, getSevenDaysForecast } from './openMeteo';
import { isFavoriteCity, toggleFavoriteCity } from '@/utils/storage';

type ForecastDayModel = {
    date: string;
    weathercode: number;
    temp_max: number;
    temp_min: number;
};

export default function CityView() {
    const backgroundColor = useThemeColor({}, 'background');
    const { name } = useLocalSearchParams<{ name: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const [currentTemperature, setCurrentTemperature] = useState(0);
    const [currentWeatherCode, setCurrentWeatherCode] = useState(0);
    const [forecastDays, setForecastDays] = useState<ForecastDayModel[]>([]);

    useEffect(() => {
        async function load() {
            setIsLoading(true);

            const favorite = await isFavoriteCity(name);
            setIsFavorite(favorite);

            const location = await getCityLocation(name);
            const forecast = await getSevenDaysForecast(location.latitude, location.longitude);

            setCurrentTemperature(forecast.current.temperature);
            setCurrentWeatherCode(forecast.current.weathercode);
            setForecastDays(forecast.days);

            setIsLoading(false);
        }

        load();
    }, [name]);

    async function handleToggleFavorite() {
        const next = await toggleFavoriteCity(name);
        setIsFavorite(next);
        router.replace({ pathname: '/', params: { favRefresh: String(Date.now()) } });
    }

    const currentIcon = iconForCode(currentWeatherCode);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.cityName}>{name}</ThemedText>

                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
                >
                    <ThemedText type="defaultSemiBold">
                        {isFavorite ? 'Favori' : 'Ajouter'}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <View style={styles.card}>
                        <Image source={currentIcon} style={styles.currentIcon} />

                        <View>
                            <ThemedText type="subtitle" style={styles.currentTemperature}>
                                {Math.round(currentTemperature)}°C
                            </ThemedText>

                            <ThemedText style={styles.todayRange}>
                                {Math.round(forecastDays[0].temp_max)}° / {Math.round(forecastDays[0].temp_min)}°
                            </ThemedText>
                        </View>
                    </View>

                    <FlatList
                        data={forecastDays}
                        keyExtractor={(item) => item.date}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => <ForecastDay {...item} />}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    cityName: { fontSize: 28, fontWeight: '700' },

    favoriteButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },

    favoriteButtonActive: {
        backgroundColor: 'rgba(255,215,0,0.12)',
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 14,
        backgroundColor: 'rgba(10,126,164,0.06)',
        marginBottom: 18,
    },

    currentIcon: { width: 92, height: 92, marginRight: 14 },
    currentTemperature: { fontSize: 40, fontWeight: '700' },
    todayRange: { fontSize: 14, color: '#6b7280', marginTop: 6 },
    list: { paddingVertical: 8 },
});
