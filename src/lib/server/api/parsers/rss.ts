import { responses } from '..';
import { XMLParser } from 'fast-xml-parser';

export default function (widget: WidgetData): object | undefined {
	try {
		const response = responses[widget.settings.url];
		if (response === undefined) return;

		const parser = new XMLParser({ ignoreAttributes: false });
		const rss = parser.parse(response);

		const items = rss.rss.channel.item.slice(0, widget.settings.items);
		return items;
	} catch (error) {
		console.error(
			`[api]: failed to read RSS feed. widget id: ${widget.id}, url: ${widget.settings.url}, error: ${error}`
		);
		return;
	}
}
