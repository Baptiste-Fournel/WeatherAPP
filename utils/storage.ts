import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export async function getFavoriteCityNames(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function isFavoriteCity(name: string): Promise<boolean> {
  const favorites = await getFavoriteCityNames();
  return favorites.includes(name);
}

export async function toggleFavoriteCity(name: string): Promise<boolean> {
  const favorites = await getFavoriteCityNames();
  const exists = favorites.includes(name);

  const updated = exists
      ? favorites.filter((n) => n !== name)
      : [name, ...favorites];

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}
