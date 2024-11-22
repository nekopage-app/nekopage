import axios from "axios";
import chalk from "chalk";
import * as cookie from "cookie";

import * as database from '$lib/server/database';

import { template, templateRecords } from '$lib/utils/handlebars';
import widgetsJSON from '$lib/data/widgets.json';
const widgetsData: WidgetsJSON = widgetsJSON;

import adguardhome from './parsers/adguardhome';
import astronomy from './parsers/astronomy';
import lastfm from './parsers/lastfm';
import rss from './parsers/rss';
import torrent from "./parsers/torrent";
import weather from './parsers/weather';

export let responses: Record<number, WidgetApiResponsesByName> = {};
export const parsers = {
	AdGuardHome: adguardhome,
	Astronomy: astronomy,
	LastFM: lastfm,
	RSS: rss,
	Torrent: torrent,
	Weather: weather
};

/**
 * Request APIs for a specific widget
 *
 * @param {WidgetData} widget - The widget data
 * @param {boolean} check - Check if API has already been requested
 */
export async function request(widget: WidgetData, check = false) {
	const { apis } = widget.settings;
	const apisList = widgetsData[widget.type].apis.list;
	if (!apisList || !apis) return;

	// Go through each specified API in widget's settings
	for (const apiName of apis) {
		const api = apisList[apiName];
		const widgetResponses = responses[widget.id] ?? {};

		const url = template(api.url, widget);
		const method = api.method ?? "GET";
		let headers = api.headers ?? {};
		let cookies = api.cookies ?? {};
		let body = api.body ?? {};

		// Return if no URL is set or the URL is already fetched
		if (!url || (check && responses[widget.id])) return;

		// Template objects
		templateRecords(headers, widget, widgetResponses);
		templateRecords(cookies, widget, widgetResponses);

		// Template body differently if it is an object
		if (typeof body === "object")
			templateRecords(body, widget, widgetResponses);
		else
			template(body, widget, widgetResponses);

		// Add cookies as a header
		headers["Cookie"] = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join("; ");

		console.info(`[api]: fetching widget api data. id: ${widget.id}, type: ${widget.type}, api: ${apiName}, url: ${url}`);

		// Fetch API
		try {
			const response = await axios({
				url,
				method,
				headers,
				data: body
			});

			const setCookieHeader = response.headers["set-cookie"] ?? [];
			const cookies = cookie.parse(setCookieHeader[0] ?? "");

			// Add data and cookies to responses variable
			responses[widget.id] = responses[widget.id] ?? {};
			responses[widget.id][apiName] = {
				cookies,
				data: response.data
			};
		} catch (error) {
			if (error.response) {
				console.error(chalk.red(`[api]: failed to fetch widget api data! id: ${widget.id}, type: ${widget.type}, api: ${apiName}, url: ${url}, status: ${error.response.status}`));
			} else {
				console.error(chalk.red(`[api]: failed to fetch widget api data! id: ${widget.id}, type: ${widget.type}, api: ${apiName}, url: ${url}, error:`), error);
			}
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
 * Parse response for widget
 */
export function parse(widget: WidgetData): object | undefined {
	try {
		const parser = parsers[widget.type as keyof typeof parsers];

		// Get response
		const widgetResponses = responses[widget.id];
		if (widgetResponses === undefined) console.warn(chalk.yellow(`[api]: failed to get response for widget! id: ${widget.id}`));

		return parser(widget, widgetResponses);
	} catch (error) {
		console.error(chalk.red(`[api]: failed to parse data for widget! id: ${widget.id}, type: ${widget.type}, error:`), error);
		return;
	}
}