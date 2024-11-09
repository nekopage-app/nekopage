// Parses weather data into a unified format

import { getResponse } from '..';
import weatherapicomIcons from '$lib/data/weather/weatherapi.com.json';

interface WeatherJSON {
	place: string;
	country: string;
	condition: string;
	icon: string;
	temperature: number;
	rainChance: number;
	wind: number;
	humidity: number;
}

export default function (widget: WidgetData): WeatherJSON | undefined {
	const response = getResponse(widget);
	if (response === undefined) return;

	switch (widget.settings.api) {
		case 'weatherapi.com': {
			return {
				place: response.location.name,
				country: response.location.country,
				condition: response.current.condition.text,
				icon: weatherapicomIcons[
					response.current.condition.code as keyof typeof weatherapicomIcons
				],
				temperature: Math.floor(response.current.temp_c),
				rainChance: response.forecast.forecastday[0].day.daily_will_it_rain,
				wind: response.current.wind_kph,
				humidity: response.current.humidity
			};
		}

		default:
			console.error('[api]: api property not valid for weather widget');
			return;
	}
}