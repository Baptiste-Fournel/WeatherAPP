import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import CityCard from '@/components/city-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

import { getFavoriteCityNames } from '@/utils/storage';
import { getCityLocation, getCurrentWeather } from './openMeteo';
import { iconForCode } from '@/utils/weather';

type CityCardModel = {
  name: string;
  temperatureLabel: string;
  weathercode?: number;
};

export default function HomeScreen() {
  const headerImage = (
      <Image source={require('../../assets/meteo/sun.png')} style={styles.headerImage} resizeMode="cover" />
  );

  const backgroundColor = useThemeColor({}, 'background');
  const inputColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'icon');

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<CityCardModel | null>(null);
  const [favorites, setFavorites] = useState<CityCardModel[]>([]);

  const { favRefresh } = useLocalSearchParams();

  useEffect(() => {
    async function loadFavorites() {
      const names = await getFavoriteCityNames();
      const cards = await Promise.all(
          names.map(async (cityName) => {
            try {
              const location = await getCityLocation(cityName);
              const current = await getCurrentWeather(location.latitude, location.longitude);

              return {
                name: location.name,
                temperatureLabel: `${Math.round(current.temperature)}°C`,
                weathercode: current.weathercode,
              };
            } catch {
              return { name: cityName, temperatureLabel: '--' };
            }
          })
      );

      setFavorites(cards);
    }

    loadFavorites();
  }, [favRefresh]);

  async function handleSearch() {
    const cityName = query.trim();
    if (!cityName) return;

    try {
      const location = await getCityLocation(cityName);
      const current = await getCurrentWeather(location.latitude, location.longitude);

      setSearchResult({
        name: location.name,
        temperatureLabel: `${Math.round(current.temperature)}°C`,
        weathercode: current.weathercode,
      });
    } catch {
      setSearchResult({ name: 'Erreur', temperatureLabel: 'API indisponible' });
    }
  }

  return (
      <ParallaxScrollView headerImage={headerImage} headerBackgroundColor={{ light: '#7ec8ff', dark: '#0b3a5e' }}>
        <View style={[styles.container, { backgroundColor }]}>
          <ThemedText type="title" style={styles.title}>Météo</ThemedText>

          <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher une ville"
              placeholderTextColor={placeholderColor}
              style={[styles.searchInput, { color: inputColor }]}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
          />

          {searchResult && (
              <CityCard
                  image={iconForCode(searchResult.weathercode)}
                  title={searchResult.name}
                  degree={searchResult.temperatureLabel}
                  onPress={() => router.push({ pathname: '/cityView', params: { name: searchResult.name } })}
              />
          )}

          <ThemedText type="subtitle" style={styles.sectionTitle}>Villes favorites</ThemedText>

          <FlatList
              data={favorites}
              horizontal
              keyExtractor={(item) => item.name}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
              renderItem={({ item }) => (
                  <CityCard
                      image={iconForCode(item.weathercode)}
                      title={item.name}
                      degree={item.temperatureLabel}
                      onPress={() => router.push({ pathname: '/cityView', params: { name: item.name } })}
                  />
              )}
          />
        </View>
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: { width: '100%', height: '100%' },
  container: { flex: 1, width: '100%', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(10,126,164,0.06)',
    fontSize: 16,
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  favoritesList: { paddingVertical: 8 },
});
