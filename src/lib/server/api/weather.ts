// Fetches and parses weather data from user's selected APIs into a unified structure (see the WeatherJSON interface in ./types.d.ts).
// This function returns temperature in Celsius and wind speed in KPH.
// The client will calculate alternative measurements if needed.
// Additionally, it also maps weather icons to a unified set of icons.

import { env } from "$env/dynamic/private";

// Icons
import weatherapicomIcons from "$lib/data/weather/weatherapi.com.json";

export default async function getWeatherData(settings: WidgetSettings): Promise<WeatherJSON> {
	let weatherJson = <WeatherJSON>{};

	let apiKey = settings.api_key || env.WEATHERAPI_KEY;

	switch (settings.api) {
		case 'weatherapi.com':
			const request = await fetch(
				`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${settings.location}&days=1&aqi=no&alerts=false`
			);
			const response = await request.json();

            weatherJson = {
                place: response.location.name,
                country: response.location.country,
                condition: response.current.condition.text,
                icon: weatherapicomIcons[response.current.condition.code as keyof typeof weatherapicomIcons],
                temperature: Math.floor(response.current.temp_c),
                rainChance: response.forecast.forecastday[0].day.daily_will_it_rain,
                wind: response.current.wind_kph,
                humidity: response.current.humidity
            };
            break;

		default:
			throw new Error('API property not valid for weather widget');
	}

	return weatherJson;
}
