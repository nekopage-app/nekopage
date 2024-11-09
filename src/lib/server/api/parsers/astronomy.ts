// Parses astronomy data into a unified format

import { getResponse, } from '..';
import moonIcons from '$lib/data/moon_icons.json';

interface AstronomyJSON {
	moonPhase: string;
	icon: string;
	sunrise: number;
	sunset: number;
}

export default function (widget: WidgetData): AstronomyJSON | undefined {
	const response = getResponse(widget);
	if (response === undefined) return;

	switch (widget.settings.api) {
		case 'weatherapi.com': {
			const sunrise = new Date(`01 Jan 1970 ${response.astronomy.astro.sunrise}`);
			const sunset = new Date(`01 Jan 1970 ${response.astronomy.astro.sunset}`);

			return {
				moonPhase: response.astronomy.astro.moon_phase,
				icon: moonIcons[response.astronomy.astro.moon_phase as keyof typeof moonIcons],
				sunrise: sunrise.getTime(),
				sunset: sunset.getTime()
			};
		}

		default:
			console.error('[api]: api property not valid for astronomy widget');
			return;
	}
}
