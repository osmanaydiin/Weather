interface WeatherDataInterface {
    time: string | Date;
    temperature2m: number;
    apparentTemperature: number;
    cloudCover: number;
    isDay: boolean;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    status: string;
    showStatus: string;
}

export class WeatherData implements WeatherDataInterface {
    time: string | Date;
    temperature2m: number;
    apparentTemperature: number;
    cloudCover: number;
    isDay: boolean;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    status: string;
    showStatus: string;

    constructor(data: any) {
        this.time = new Date(data.time);
        this.temperature2m = data.temperature2m || 0;
        this.apparentTemperature = data.apparentTemperature || 0;
        this.cloudCover = data.cloudCover || 0;
        this.isDay = data.isDay || false;
        this.precipitation = data.precipitation;
        this.rain = data.rain;
        this.showers = data.showers;
        this.snowfall = data.snowfall;
        [this.status, this.showStatus] = this.determineWeatherStatus(this.cloudCover, this.precipitation, this.rain, this.snowfall, this.showers);
    }
    private determineWeatherStatus(cloudCover: number, precipitation: number, rain: number, snowfall: number, showers: number): [string, string] {
        if (snowfall > 0 && rain > 0) {
            return ["sleet", "Sleet"]; // Karla karışık yağmur
        } else if (snowfall > 0) {
            return ["snowly", "Snowly"]; // Kar yağışı
        } else if (showers > 0) {
            return ["showerly", "showerly"]; // Şiddetli yağmur
        } else if (rain > 0) {
            return ["rainy", "Rainy"]; // Normal yağmur
        } else if (cloudCover >= 70) {
            return ["cloudy", "Cloudy"]; // Bulutlu
        } else if (cloudCover >= 30) {
            return ["partly_cloudy", "Partly Cloudy"]; // Parçalı bulutlu
        } else {
            return ["sunny", "Sunny"]; // Güneşli
        }
    }
} 