import chalk from 'chalk';

import moonIcons from '$lib/data/moon_icons.json';

interface AstronomyJSON {
	moonPhase: string;
	icon: string;
	sunrise: number;
	sunset: number;
}

export default function (widget: WidgetData, response: WidgetAPIResponse): AstronomyJSON | undefined {
	switch (widget.settings.api) {
		case 'weatherapi.com': {
			const sunrise = new Date(`01 Jan 1970 ${response.data.astronomy.astro.sunrise}`);
			const sunset = new Date(`01 Jan 1970 ${response.data.astronomy.astro.sunset}`);

			return {
				moonPhase: response.data.astronomy.astro.moon_phase,
				icon: moonIcons[response.data.astronomy.astro.moon_phase as keyof typeof moonIcons],
				sunrise: sunrise.getTime(),
				sunset: sunset.getTime()
			};
		}

		default:
			console.error(chalk.red(`[api]: api property not valid for astronomy widget! id: ${widget.id}`));
			return;
	}
}
