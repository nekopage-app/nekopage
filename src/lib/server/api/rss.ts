import { XMLParser } from "fast-xml-parser";

export default async function fetchRssFeed(settings: WidgetSettings) {
    if (!settings.url) return;

    const request = await fetch(settings.url);
    const response = await request.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const rss = parser.parse(response);

    return rss;
}