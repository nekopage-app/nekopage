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

export default function (widget: WidgetData, responses: WidgetApiResponsesByName): WeatherJSON | undefined {
	const [ apiName, api ] = Object.entries(responses)[0];

	switch (apiName) {
		case 'weatherapi.com': {
			return {
				place: api.data.location.name,
				country: api.data.location.country,
				condition: api.data.current.condition.text,
				icon: weatherapicomIcons[
					api.data.current.condition.code as keyof typeof weatherapicomIcons
				],
				temperature: Math.floor(api.data.current.temp_c),
				rainChance: api.data.forecast.forecastday[0].day.daily_will_it_rain,
				wind: api.data.current.wind_kph,
				humidity: api.data.current.humidity
			};
		}

		default:
			console.error(chalk.red(`[api]: api property not valid for weather widget! id: ${widget.id}`));
			return;
	}
}