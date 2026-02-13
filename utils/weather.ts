export function iconForCode(code?: number) {
    const icons = {
        sun: require('../assets/meteo/sun.png'),
        clouds: require('../assets/meteo/clouds.png'),
        cloudy: require('../assets/meteo/cloudy.png'),
        rain: require('../assets/meteo/rain.png'),
        snow: require('../assets/meteo/snow.png'),
        storm: require('../assets/meteo/storm.png'),
    };

    if (code == null) return icons.sun;
    if (code === 0) return icons.sun;
    if ([1, 2, 3].includes(code)) return icons.clouds;
    if ([45, 48].includes(code)) return icons.cloudy;

    if (
        [51, 53, 55].includes(code) ||
        [56, 57].includes(code) ||
        [61, 63, 65].includes(code) ||
        [80, 81, 82].includes(code)
    ) return icons.rain;

    if (
        [66, 67].includes(code) ||
        [71, 73, 75].includes(code) ||
        code === 77 ||
        [85, 86].includes(code)
    ) return icons.snow;

    if ([95, 96, 99].includes(code)) return icons.storm;

    return icons.cloudy;
}
