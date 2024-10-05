// Fetches and parses astronomy data from user's selected APIs into a unified structure (see the AstronomyJSON interface in ./types.d.ts).
// Additionally, it also maps astronomy icons to a unified set of icons.
import moonIcons from "$lib/data/moon_icons.json";

export default async function fetchAstronomyData(settings: WidgetSettings): Promise<AstronomyJSON | null> {
	switch (settings.api) {
		case 'weatherapi.com': {
			const request = await fetch(
				`https://api.weatherapi.com/v1/astronomy.json?key=${settings.api_key}&q=${settings.location}`
			);

			if (request.status == 200) {
				const response = await request.json();

				return {
                    moonPhase: response.astronomy.astro.moon_phase,
					icon: moonIcons[response.astronomy.astro.moon_phase as keyof typeof moonIcons],
                    sunrise: response.astronomy.astro.sunrise.toLowerCase(),            // Set the period to lowercase
                    sunset: response.astronomy.astro.sunset.toLowerCase()               // Set the period to lowercase
				};
			}
			break;
		};

		default:
			throw new Error('API property not valid for astronomy widget');
	}

	return null;
}
