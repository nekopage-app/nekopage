interface LastFMJSON {
	playing: number;
	scrobbles: number;
	name: string;
	artist: string;
	album: string;
	albumCover: string;
    url: string;
}

export default function (widget: WidgetData, responses: WidgetApiResponsesByName): LastFMJSON | undefined {
    const currentTrack = responses["fetch"].data.recenttracks.track[0];

    return {
        playing: currentTrack?.["@attr"]?.nowplaying ?? false,
        scrobbles: responses["fetch"].data.recenttracks["@attr"].total,
        name: currentTrack.name,
        artist: currentTrack.artist["#text"],
        album: currentTrack.album["#text"],
        albumCover: currentTrack.image[1]["#text"],
        url: currentTrack["url"]
    }
}