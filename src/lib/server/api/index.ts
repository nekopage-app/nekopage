import * as database from '$lib/server/database';

import fetchWeatherData from './weather';
import fetchRssFeed from './rss';

export const responses: ApiResponses = {};

/**
 * Requests APIs for widgets to use
 */
export async function requestAll() {
	const widgets = database.layouts.getAllWidgets();

	for (const widget of widgets) {
		console.log(widget.name)
		switch (widget.name) {
			case 'Weather':
				console.info(`[api]: fetching weather data for widget ID: ${widget.id}`);
				responses[widget.id] = await fetchWeatherData(widget.settings);
				break;
			case 'RSS':
				console.info(`[api]: fetching RSS feed for widget ID: ${widget.id}`);
				responses[widget.id] = await fetchRssFeed(widget.settings);
				break;
		}
	}
}