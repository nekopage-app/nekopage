// Fetches and parses weather data from user's selected APIs into a unified structure (see the WeatherJSON interface in ./types.d.ts).
// This function returns temperature in Celsius and wind speed in KPH.
// The client will calculate alternative measurements if needed.
// Additionally, it also maps weather icons to a unified set of icons.
import weatherapicomIcons from '$lib/data/weather/weatherapi.com.json';

/**
 * Fetch weather data for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<WeatherJSON | object>} - The data returned
 */
export default async function fetchWeatherData(widget: WidgetData): Promise<WeatherJSON | object> {
	switch (widget.settings.api) {
		case 'weatherapi.com': {
			try {
				const request = await fetch(
					`http://api.weatherapi.com/v1/forecast.json?key=${widget.settings.api_key}&q=${widget.settings.location}&days=1&aqi=no&alerts=false`
				);

				if (!request.ok) {
					console.error(
						`[api]: failed to fetch weather data. widget id: ${widget.id}, api: weatherapi.com, status: ${request.status}`
					);
					return {};
				}

				const response = await request.json();

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
			} catch (error) {
				console.error(
					`[api]: failed to fetch weather data. widget id: ${widget.id}, api: weatherapi.com, error: ${error}`
				);
				return {};
			}
		}

		default:
			console.error('[api]: api property not valid for weather widget');
			return {};
	}
}
