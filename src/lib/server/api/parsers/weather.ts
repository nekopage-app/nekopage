// Parses weather data into a unified format

import { responses } from '..';
import weatherapicomIcons from '$lib/data/weather/weatherapi.com.json';

import template from '$lib/utils/handlebars';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

export default function (widget: WidgetData): WeatherJSON | object {
	const response = responses[template(widget, widgetAPIs[widget.type].apis[widget.settings.api].url)];

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
			return {};
	}
}