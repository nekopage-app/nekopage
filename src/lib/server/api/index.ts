import * as database from '$lib/server/database';

import template from '$lib/utils/template';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

import astronomy from './parsers/astronomy';
import rss from './parsers/rss';
import weather from './parsers/weather';

export let responses: Record<string, any> = {};
export const parsers = {
	Astronomy: astronomy,
	RSS: rss,
	Weather: weather
};

/**
 * Request API for a specific widget
 *
 * @param {WidgetData} widget - The widget data
 * @param {boolean} check - Check if API has already been requested
 */
export async function request(widget: WidgetData, check = false) {
	// If URL in widget settings not found, that means it is probably hard coded in widget_apis.json
	let url = widget.settings.url ?? null;

	if (!url) {
		const requestSettings = widgetAPIs[widget.type]?.[widget.settings.api];
		if (!requestSettings) return;

		url = template(widget, requestSettings.url);
	}

	// Return if no URL is found or the response is already fetched
	if (!url || (check && responses[url])) return;

	console.info(`[api]: fetching ${widget.type} data for widget ID: ${widget.id}`);

	try {
		const response = await fetch(url);

		const contentType = response.headers.get('Content-Type');
		if (!contentType) throw Error('No Content-Type header found');

		const data = contentType == 'application/json' ? await response.json() : await response.text();
		responses[url] = data;
	} catch (error) {
		console.error(`[api]: failed to fetch ${widget.type} data for widget ID: ${widget.id}`, error);
	}
}

export async function init() {
	function requestAll() {
		const widgets = database.layouts.getAllWidgets();

		for (const widget of widgets) {
			request(widget, true);
		}
	}

	requestAll();

	// Clear responses every 24 hours to save memory
	setInterval(
		() => {
			responses = {};
			requestAll();
		},
		1000 * 60 * 60 * 24
	);
}
