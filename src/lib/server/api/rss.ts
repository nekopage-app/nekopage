import { XMLParser } from 'fast-xml-parser';

/**
 * Fetch RSS feed for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<object | null>} - The data returned
 */
export default async function fetchRssFeed(widget: WidgetData): Promise<object | null> {
	if (!widget.settings.url) {
		console.error(
			`[api]: no url property was found when fetching rss feed. widget id: ${widget.id}`
		);
		return null;
	}

	const request = await fetch(widget.settings.url);
	const response = await request.text();

	const parser = new XMLParser({ ignoreAttributes: false });
	const rss = parser.parse(response);

	return rss;
}
