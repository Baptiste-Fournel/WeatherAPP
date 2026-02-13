export type CityLocation = {
    name: string;
    latitude: number;
    longitude: number;
};

export type CurrentWeather = {
    temperature: number;
    weathercode: number;
};

export type DailyForecast = {
    date: string;
    weathercode: number;
    temp_max: number;
    temp_min: number;
};

export async function getCityLocation(cityName: string): Promise<CityLocation> {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr`
    );
    const data = await response.json();
    const city = data.results[0];

    return {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
    };
}

export async function getCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
    );
    const data = await response.json();

    return {
        temperature: data.current_weather.temperature,
        weathercode: data.current_weather.weathercode,
    };
}

export async function getSevenDaysForecast(latitude: number, longitude: number): Promise<{
    current: CurrentWeather;
    days: DailyForecast[];
}> {
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10);
    const end = new Date(today);
    end.setDate(today.getDate() + 6);
    const endDate = end.toISOString().slice(0, 10);

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
        `&current_weather=true&timezone=auto&start_date=${startDate}&end_date=${endDate}`
    );

    const data = await response.json();

    const days: DailyForecast[] = data.daily.time.map((date: string, index: number) => ({
        date,
        weathercode: data.daily.weathercode[index],
        temp_max: data.daily.temperature_2m_max[index],
        temp_min: data.daily.temperature_2m_min[index],
    }));

    return {
        current: {
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
        },
        days,
    };
}
