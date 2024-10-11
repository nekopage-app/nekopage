import * as database from '$lib/server/database';

import fetchAstronomyData from './astronomy';
import fetchRssFeed from './rss';
import fetchWeatherData from './weather';

export const responses: ApiResponses = {};

/**
 * Request API for a specific widget
 *
 * @param {WidgetData} widget - The widget data
 */
export async function request(widget: WidgetData) {
	switch (widget.type) {
		case 'Astronomy':
			console.info(`[api]: fetching astronomy data for widget ID: ${widget.id}`);
			responses[widget.id] = await fetchAstronomyData(widget);
			break;
		case 'RSS':
			console.info(`[api]: fetching RSS feed for widget ID: ${widget.id}`);
			responses[widget.id] = await fetchRssFeed(widget);
			break;
		case 'Weather':
			console.info(`[api]: fetching weather data for widget ID: ${widget.id}`);
			responses[widget.id] = await fetchWeatherData(widget);
			break;
	}
}

/**
 * Requests APIs for widgets to use
 */
export async function requestAll() {
	const widgets = database.layouts.getAllWidgets();

	for (const widget of widgets) {
		request(widget);
	}
}
