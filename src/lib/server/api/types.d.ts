interface ApiResponses {
    [widgetId: string]: object
}

interface AstronomyJSON {
    moonPhase: string,
    icon: string,
    sunrise: number,
    sunset: number
}

interface WeatherJSON {
    place: string,
    country: string,
    condition: string,
    icon: string,
    temperature: number,
    rainChance: number,
    wind: number,
    humidity: number,
}