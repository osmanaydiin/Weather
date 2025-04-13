import { fetchWeatherApi } from 'openmeteo';

const url = "https://api.open-meteo.com/v1/forecast";

var weatherDataReturn = null;
//TODO: API KEY GÜNCELLE
const getData = async (name, lat, long) =>{
    const param = {
        latitude:lat,
        longitude:long,
        current: ["temperature_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "cloud_cover"],
        hourly: ["temperature_2m", "apparent_temperature", "precipitation", "rain", "showers", "snowfall", "cloud_cover"],
        daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "rain_sum", "showers_sum", "snowfall_sum", "weather_code"]
    } 
    //console.log("param => ", param);
    //console.log("name => ", name)
    const responses = await fetchWeatherApi(url, param);
    //console.log("API Yanıtı:", responses);
    // Helper function to form time ranges
    const range = (start, stop, step) =>
	    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    if(responses && responses[0]!==null){    
        const weatherData = responses[0];
        const utcOffsetSeconds = weatherData.utcOffsetSeconds();
        const timezone = weatherData.timezone();
        const timezoneAbbreviation = weatherData.timezoneAbbreviation();
        const latitude = weatherData.latitude();
        const longitude = weatherData.longitude();
        const current = weatherData.current();
        const hourly = weatherData.hourly();
        const daily = weatherData.daily();

        weatherDataReturn = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables(0).value(),
                apparentTemperature: current.variables(1).value(),
                isDay: current.variables(2).value(),
                precipitation: current.variables(3).value(),
                rain: current.variables(4).value(),
                showers: current.variables(5).value(),
                snowfall: current.variables(6).value(),
                cloudCover: current.variables(7).value(),
            },
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0).valuesArray(),
                apparentTemperature: hourly.variables(1).valuesArray(),
                precipitation: hourly.variables(2).valuesArray(),
                rain: hourly.variables(3).valuesArray(),
                showers: hourly.variables(4).valuesArray(),
                snowfall: hourly.variables(5).valuesArray(),
                cloudCover: hourly.variables(6).valuesArray(),
            },
        
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2mMax: daily.variables(0).valuesArray(),
                temperature2mMin: daily.variables(1).valuesArray(),
                precipitationSum: daily.variables(2).valuesArray(),
                rainSum: daily.variables(3).valuesArray(),
                showersSum: daily.variables(4).valuesArray(),
                snowfallSum: daily.variables(5).valuesArray(),
                weatherCode: daily.variables(6).valuesArray(),
            },
        };

        return weatherDataReturn;
    }else{
        console.error('Hava durumu verileri sağlanamadı');
        return null;
    }
}

const getWeatherDataWrapper = async (name, lat, long) => {
    if (name && lat && long) {
        return await getData(name, lat, long);
    } else {
        throw new Error('Location data is missing');
    }
};

export default getWeatherDataWrapper;