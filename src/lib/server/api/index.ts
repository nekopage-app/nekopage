import chalk from "chalk";

import * as database from '$lib/server/database';

import template from '$lib/utils/handlebars';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

import adguardhome from './parsers/adguardhome';
import astronomy from './parsers/astronomy';
import lastfm from './parsers/lastfm';
import rss from './parsers/rss';
import weather from './parsers/weather';

export let responses: Record<string, any> = {};
export const parsers = {
	AdGuardHome: adguardhome,
	Astronomy: astronomy,
	LastFM: lastfm,
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
	let { url, headers } = widget.settings;
	const apiConfig = widgetAPIs[widget.type]?.apis[widget.settings.api];

	if (!url && !apiConfig) return;

	// Template variables
	url = template(widget, apiConfig?.url ?? url ?? '');
	headers = apiConfig?.headers ?? headers ?? {};

	// Template each header
	Object.keys(headers).forEach((key) => {
		headers[key] = template(widget, headers[key]);
	});

	// Return if no URL is found or the response is already fetched
	if (!url || (check && responses[url])) return;

	console.info(`[api]: fetching ${widget.type} data for widget ID: ${widget.id}`);

	try {
		const response = await fetch(url, { headers, cache: "no-store" });

		const contentType = response.headers.get('Content-Type');
		if (!contentType) throw Error('No Content-Type header found');

		const data = contentType == 'application/json' ? await response.json() : await response.text();
		responses[url] = data;
	} catch (error) {
		console.error(chalk.red(`[api]: failed to fetch widget API data! id: ${widget.id}, url: ${url}, error:`), error);
	}
}

export async function init() {
	const activeIntervals: Record<number, NodeJS.Timeout> = {};

	function requestAll() {
		const widgets = database.layouts.getAllWidgets();

		for (const widget of widgets) {
			const apiConfig = widgetAPIs[widget.type];
			if (!apiConfig) continue;

			// Clear existing interval
			if (activeIntervals[widget.id]) clearInterval(activeIntervals[widget.id]);

			// Set interval to request widget's API
			activeIntervals[widget.id] = setInterval(() => {
				request(widget);
			}, apiConfig?.interval);

			request(widget);
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

export function parse(widget: WidgetData): object | undefined {
	try {
		const parser = parsers[widget.type as keyof typeof parsers];
		return parser(widget);
	} catch (error) {
		console.error(chalk.red(`[api]: failed to parse data for widget! id: ${widget.id}, type: ${widget.type}, error:`), error);
		return;
	}
}

export function getResponse(widget: WidgetData): any {
	const widgetAPI = widgetAPIs[widget.type].apis[widget.settings.api];
	const url = template(widget, widgetAPI.url);
	const response = responses[url];
	
	if (response === undefined) console.warn(chalk.yellow(`[api]: failed to get response for widget! id: ${widget.id}, url: ${url}`));
	return response;
}