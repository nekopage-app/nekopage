import { responses } from '..';
import { XMLParser } from 'fast-xml-parser';

/**
 * Parses an RSS feed for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<object>} - The data returned
 */
export default function (widget: WidgetData): object {
	try {
		const response = responses[widget.settings.url];

		const parser = new XMLParser({ ignoreAttributes: false });
		const rss = parser.parse(response);

		const items = rss.rss.channel.item.slice(0, widget.settings.items);
		return items;
	} catch (error) {
		console.error(
			`[api]: failed to read RSS feed. widget id: ${widget.id}, url: ${widget.settings.url}, error: ${error}`
		);
		return {};
	}
}
