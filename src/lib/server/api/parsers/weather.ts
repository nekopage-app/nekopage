// Parses weather data into a unified format

import { responses } from '..';
import weatherapicomIcons from '$lib/data/weather/weatherapi.com.json';

import template from '$lib/utils/template';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

/**
 * Fetch astronomy data for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<AstronomyJSON | object>} - The data returned
 */
export default async function (widget: WidgetData): Promise<WeatherJSON | object> {
	const response = responses[template(widget, widgetAPIs[widget.type][widget.settings.api].url)];

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