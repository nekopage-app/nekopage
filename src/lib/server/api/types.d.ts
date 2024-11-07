type WidgetAPIsList = Record<
	string,
	{
		interval: number;
		apis: Record<
			string,
			{
				url: string;
				headers: Record<string, string>;
				[key: string]: any;
			}
		>;
	}
>;

interface AdGuardHomeJSON {
	queries: number;
	blocked: number;
}

interface AstronomyJSON {
	moonPhase: string;
	icon: string;
	sunrise: number;
	sunset: number;
}

interface LastFMJSON {
	playing: number;
	scrobbles: number;
	name: string;
	artist: string;
	album: string;
	albumCover: string;
}

interface WeatherJSON {
	place: string;
	country: string;
	condition: string;
	icon: string;
	temperature: number;
	rainChance: number;
	wind: number;
	humidity: number;
}
