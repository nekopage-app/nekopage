import chalk from 'chalk';
import { XMLParser } from 'fast-xml-parser';

export default function (widget: WidgetData, response: WidgetAPIResponse): object | undefined {
	try {
		const parser = new XMLParser({ ignoreAttributes: false });
		const rss = parser.parse(response.data);

		const items = rss.rss.channel.item.slice(0, widget.settings.items);
		return items;
	} catch (error) {
		console.error(
			chalk.red(
				`[api]: failed to read RSS feed. widget id: ${widget.id}, url: ${widget.settings.url}, error: ${error}`
			)
		);
		return;
	}
}
