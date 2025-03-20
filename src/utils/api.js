import axios from 'axios';

const API_URL = import.meta.env.VITE_WEATHER_API_URL;

export const getWeatherData = async (lat, long) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                latitude: lat,
                longitude: long,
                current: ["temperature_2m", "apparent_temperature", "cloud_cover", "precipitation", "rain", "showers", "snowfall", "is_day"],
                daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "rain_sum", "showers_sum", "snowfall_sum"],
                timezone: "auto",
            }
        });
        return response.data;
    } catch (error) {
        console.error('Hava durumu verisi alınamadı:', error);
        throw error;
    }
}; 