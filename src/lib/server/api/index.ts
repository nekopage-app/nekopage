import { env } from '$env/dynamic/private';

import * as database from '$lib/server/database';

export const responses: ApiResponses = {};

export function getResponsesByLayoutId(layoutId: number): ApiResponses {
	const widgets = database.layouts.getWidgets(layoutId);

    // Get an array of widget IDs
	const widgetIds = new Set( widgets.map((widget) => widget.id));

    // Filter out the widget ids that are not in the layout and in the responses variable
	return Object.fromEntries(
		Object.entries(responses).filter(([widgetId]) => widgetIds.has(Number(widgetId)))
	);
}

/**
 * Requests APIs for the specified widget(s)
 *
 * @param {string} name - Name of the widget
 */
export async function request(name: string) {
	const widgets = database.layouts.getWidgetsByName(name);

	for (const widget of widgets) {
		if (widget.settings.api != '') {
			switch (name) {
				case 'Weather':
					let apiKey = widget.settings.api_key;
					if (apiKey == '') {
						apiKey = env.WEATHERAPI_KEY;
					}

					switch (widget.settings.api) {
						case 'weatherapi.com':
							console.info(`[api]: requesting api for widget id: ${widget.id}`);

							const request = await fetch(
								`http://api.weatherapi.com/v1/forecast.json?key=${env.WEATHERAPI_KEY}&q=${widget.settings.location}&days=1&aqi=no&alerts=${widget.settings.alerts}`
							);
							const response = await request.json();
							responses[widget.id] = response;
							break;

						default:
							throw new Error('API property not valid for weather widget');
					}
					break;
                case "News":
                    
                    break;

				default:
					break;
			}
		}
	}
}

export async function requestAll() {
	request('Weather');
}
