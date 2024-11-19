import axios from "axios";
import chalk from "chalk";

import * as database from '$lib/server/database';

import template from '$lib/utils/handlebars';
import widgetsJSON from '$lib/data/widgets.json';
const widgetsData: WidgetsJSON = widgetsJSON;

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
	const { apis } = widget.settings;
	const apisList = widgetsData[widget.type].apis.list;
	if (!apisList && !apis) return;

	for (const apiName of apis) {
		const api = apisList[apiName];

		const url = template(widget, api.url);
		const method = api.method ?? "GET";
		let headers = api.headers ?? {};

		// Template each header
		Object.keys(headers).forEach((key) => {
			headers[key] = template(widget, headers[key]);
		});

		// Return if no URL is set or the URL is already fetched
		if (!url || (check && responses[url])) return;

		console.info(`[api]: fetching ${widget.type} data for widget ID: ${widget.id}`);

		try {
			const response = await axios({
				url,
				method,
				headers
			});
	
			responses[url] = response.data;
		} catch (error) {
			console.error(chalk.red(`[api]: failed to fetch widget API data! id: ${widget.id}, type: ${widget.type}, url: ${url}, error:`), error);
		}
	}
}

export async function init() {
	const activeIntervals: Record<number, NodeJS.Timeout> = {};

	// Request all widgets and start intervals for fetching all of them
	function requestAll() {
		const widgets = database.layouts.getAllWidgets();

		for (const widget of widgets) {
			const apiConfig = widgetsData[widget.type].apis;
			if (!apiConfig?.interval) continue;

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

/**
 * Get response for widget
 */
export function getResponse(widget: WidgetData): any {
	const widgetAPI = widgetsData[widget.type]?.apis.list[widget.settings.api];
	const url = template(widget, widgetAPI.url);
	const response = responses[url];
	
	if (response === undefined) console.warn(chalk.yellow(`[api]: failed to get response for widget! id: ${widget.id}, url: ${url}`));
	return response;
}

/**
 * Parse response for widget
 */
export function parse(widget: WidgetData): object | undefined {
	try {
		const parser = parsers[widget.type as keyof typeof parsers];
		return parser(widget);
	} catch (error) {
		console.error(chalk.red(`[api]: failed to parse data for widget! id: ${widget.id}, type: ${widget.type}, error:`), error);
		return;
	}
}