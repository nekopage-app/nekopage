// Parses astronomy data into a unified format

import { responses } from '..';
import moonIcons from '$lib/data/moon_icons.json';

import template from '$lib/utils/template';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

/**
 * Parses astronomy data for a widget
 *
 * @param {WidgetData} widget - The widget data
 *
 * @returns {Promise<AstronomyJSON | object>} - The data returned
 */
export default async function (widget: WidgetData): Promise<AstronomyJSON | object> {
	const response = responses[template(widget, widgetAPIs[widget.type][widget.settings.api].url)];

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
			return {};
	}
}
