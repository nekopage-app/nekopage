import { getResponse } from '..';

interface LastFMJSON {
	playing: number;
	scrobbles: number;
	name: string;
	artist: string;
	album: string;
	albumCover: string;
    url: string;
}

export default function (widget: WidgetData): LastFMJSON | undefined {
	const response = getResponse(widget);
	if (response === undefined) return;

    const currentTrack = response.recenttracks.track[0];

    return {
        playing: currentTrack?.["@attr"]?.nowplaying ?? false,
        scrobbles: response.recenttracks["@attr"].total,
        name: currentTrack.name,
        artist: currentTrack.artist["#text"],
        album: currentTrack.album["#text"],
        albumCover: currentTrack.image[1]["#text"],
        url: currentTrack["url"]
    }
}