import chalk from 'chalk';

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

export default function (widget: WidgetData, response: WidgetAPIResponse): WeatherJSON | undefined {
	switch (widget.settings.api) {
		case 'weatherapi.com': {
			return {
				place: response.data.location.name,
				country: response.data.location.country,
				condition: response.data.current.condition.text,
				icon: weatherapicomIcons[
					response.data.current.condition.code as keyof typeof weatherapicomIcons
				],
				temperature: Math.floor(response.data.current.temp_c),
				rainChance: response.data.forecast.forecastday[0].day.daily_will_it_rain,
				wind: response.data.current.wind_kph,
				humidity: response.data.current.humidity
			};
		}

		default:
			console.error(chalk.red(`[api]: api property not valid for weather widget! id: ${widget.id}`));
			return;
	}
}