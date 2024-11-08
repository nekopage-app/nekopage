import { responses } from '..';

import template from '$lib/utils/handlebars';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

interface LastFMJSON {
	playing: number;
	scrobbles: number;
	name: string;
	artist: string;
	album: string;
	albumCover: string;
}

export default function (widget: WidgetData): LastFMJSON {
	const response = responses[template(widget, widgetAPIs[widget.type].apis[widget.settings.api].url)];

    const currentTrack = response.recenttracks.track[0];

    return {
        playing: currentTrack?.["@attr"]?.nowplaying ?? false,
        scrobbles: response.recenttracks["@attr"].total,
        name: currentTrack.name,
        artist: currentTrack.artist["#text"],
        album: currentTrack.album["#text"],
        albumCover: currentTrack.image[1]["#text"]
    }
}