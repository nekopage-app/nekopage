import chalk from 'chalk';
import { XMLParser } from 'fast-xml-parser';

import { responses } from '..';

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
			chalk.red(
				`[api]: failed to read RSS feed. widget id: ${widget.id}, url: ${widget.settings.url}, error: ${error}`
			)
		);
		return;
	}
}
