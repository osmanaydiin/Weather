import { createContext, useContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const [isWeatherShow, setIsWeatherShow] = useState(true); // Başlangıçta true

    return (
        <WeatherContext.Provider value={{ isWeatherShow, setIsWeatherShow }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => {
    return useContext(WeatherContext);
};