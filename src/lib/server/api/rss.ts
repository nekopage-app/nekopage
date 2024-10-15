import { XMLParser } from 'fast-xml-parser';

/**
 * Fetch RSS feed for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<object>} - The data returned
 */
export default async function fetchRssFeed(widget: WidgetData): Promise<object> {
	try {
		if (!widget.settings.url) {
			console.error(
				`[api]: no url property was found when fetching rss feed. widget id: ${widget.id}`
			);
			return {};
		}

		const request = await fetch(widget.settings.url);
		const response = await request.text();

		if (!request.ok) {
			console.error(
				`[api]: failed to fetch RSS feed. widget id: ${widget.id}, url: ${widget.settings.url}, status: ${request.status}`
			);
			return {};
		}

		const parser = new XMLParser({ ignoreAttributes: false });
		const rss = parser.parse(response);

		const items = rss.rss.channel.item.slice(0, widget.settings.items);
		return items;
	} catch (error) {
		console.error(
			`[api]: failed to fetch RSS feed. widget id: ${widget.id}, url: ${widget.settings.url}, error: ${error}`
		);
		return {};
	}
}
