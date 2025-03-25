import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../context/locationContext";
import getWeatherData from "../controller/callWeather.ts";
import { WeatherData } from "../models/WeatherData";
import { WeatherContext } from "../context/weatherContext";

const formatTime = (timeString) => {
    if (!timeString) return "Zaman bilgisi yok";
    
    try {
        const date = typeof timeString === 'string' ? new Date(timeString) : timeString;
        
        if (isNaN(date.getTime())) {
            console.error("Geçersiz tarih:", timeString);
            return "Geçersiz tarih";
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[date.getDay()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${dayName} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Tarih formatlanırken hata oluştu:", error);
        return "Tarih hatası";
    }
};

const Weather = ({ onSearchPerformed }) => {
    const { locationName, locationLat, locationLong } = useContext(LocationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [dailyWeather, setDailyWeather] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [hasWeatherData] = useState(false);
    const [initialLoad] = useState(true);
    const { isWeatherShow } = useContext(WeatherContext);
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setIsLoading(true);
                const data = await getWeatherData(locationName, locationLat, locationLong);

                if (!data || !data.current) {
                    throw new Error('No weather data found');
                }
                //console.log("data => ", data);
                const dailyWeatherData = [];
                for(let i = 0; i < data.daily.time.length; i++) {
                    const dailyData = {
                        time: data.daily.time[i],
                        temperature2m: data.daily.temperature2mMax[i],
                        apparentTemperature: data.daily.temperature2mMin[i],
                        precipitation: data.daily.precipitationSum[i], 
                        rain: data.daily.rainSum[i],
                        showers: data.daily.showersSum[i],
                        snowfall: data.daily.snowfallSum[i],
                        cloudCover: 0
                    };
                    dailyWeatherData.push(new WeatherData(dailyData));
                }
                setDailyWeather(dailyWeatherData);
                //console.log("Günlük hava durumu verileri:", dailyWeatherData);
                const current = new WeatherData(data.current);
                setCurrentWeather(current);

                setSearchPerformed(true);
                onSearchPerformed(true);
                setIsLoading(false);
            } catch (error) {
                console.error('Hata:', error);
                setCurrentWeather(null);
                setSearchPerformed(true);
                onSearchPerformed(false);
                setIsLoading(false);
            }
        };

        if (locationName && locationLat && locationLong) {
            fetchWeather();
        }
    }, [locationName, locationLat, locationLong, onSearchPerformed]);

    const getTemperatureClass = (temp) => {
        if (temp > 25) return 'hot';
        if (temp < 10) return 'cold';
        return '';
    };

    if (isLoading) return <div className="weather-message">Yükleniyor...</div>;
    if (searchPerformed && !currentWeather) return <div className="weather-message">Hava durumu verisi bulunamadı.</div>;
    if (!searchPerformed) return null;

    return (
        <div className={`${isWeatherShow ? 'weather-section' : ''} ${initialLoad && hasWeatherData ? 'initial-load' : ''}`}>
            {isWeatherShow ? 
                <div className={`weather-section ${initialLoad && hasWeatherData ? 'initial-load' : ''}`}>
                    <div id="weatherValues" className="weather">
                        <h2 style={{margin:0,}} >{locationName} Weather</h2>
                        <div className="weather-main">
                            <div className="left-section">
                                <p className="time">{formatTime(currentWeather.time)}</p>
                                <p className={`temperature ${getTemperatureClass(currentWeather.temperature2m)}`}>
                                    Normal: {currentWeather.temperature2m.toFixed(1)}°C
                                </p>
                                <p className="feels-like">
                                    Feeling: {currentWeather.apparentTemperature.toFixed(1)}°C
                                </p>
                            </div>
                            <div className="right-section">
                                <img 
                                    src={require(`../images/weather-status/${currentWeather.status}.png`)}
                                    alt={currentWeather.status}
                                    className="weather-icon"
                                />
                                <p className="status">{currentWeather.showStatus}</p>
                            </div>
                        </div>
                        <div className="daily-forecast">
                            {dailyWeather.map((day, index) => (
                                <div key={index} className="forecast-item">
                                    <p styleName='' className="day">{formatTime(day.time).split(' ')[0]}</p>
                                    <img 
                                        src={require(`../images/weather-status/${day.status}.png`)}
                                        alt={day.status}
                                        className="forecast-icon"
                                    />
                                    <div className="temp-range">
                                        <span className="max">{day.temperature2m.toFixed(1)}°</span>/
                                        <span className="min">{day.apparentTemperature.toFixed(1)}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            : null}
        </div>
    );
};

export default Weather;

