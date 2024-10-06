// Fetches and parses astronomy data from user's selected APIs into a unified structure (see the AstronomyJSON interface in ./types.d.ts).
// Additionally, it also maps astronomy icons to a unified set of icons.
import moonIcons from '$lib/data/moon_icons.json';

/**
 * Fetch astronomy data for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<AstronomyJSON | null>} - The data returned
 */
export default async function fetchAstronomyData(
	widget: WidgetData
): Promise<AstronomyJSON | null> {
	switch (widget.settings.api) {
		case 'weatherapi.com': {
			try {
				const request = await fetch(
					`https://api.weatherapi.com/v1/astronomy.json?key=${widget.settings.api_key}&q=${widget.settings.location}`
				);

				if (!request.ok) {
					console.error(
						`[api]: failed to fetch astronomy data. widget id: ${widget.id}, api: weatherapi.com, status: ${request.status}`
					);
					return null;
				}

				const response = await request.json();

				const sunrise = new Date(`01 Jan 1970 ${response.astronomy.astro.sunrise}`);
				const sunset = new Date(`01 Jan 1970 ${response.astronomy.astro.sunset}`);
				
				return {
					moonPhase: response.astronomy.astro.moon_phase,
					icon: moonIcons[response.astronomy.astro.moon_phase as keyof typeof moonIcons],
					sunrise: sunrise.getTime(),
					sunset: sunset.getTime()
				};
			} catch (error) {
				console.error(
					`[api]: failed to fetch astronomy data. widget id: ${widget.id}, api: weatherapi.com, error: ${error}`
				);
				return null;
			}
		}

		default:
			console.error('[api]: api property not valid for astronomy widget');
			return null;
	}
}
