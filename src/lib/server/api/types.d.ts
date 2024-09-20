interface ApiResponses {
    [widgetId: string]: any
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