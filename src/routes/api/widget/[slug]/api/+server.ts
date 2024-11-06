import { json, type RequestHandler } from '@sveltejs/kit';

import * as api from '$lib/server/api';
import * as database from '$lib/server/database';

export const GET: RequestHandler = async ({ locals, params }) => {
	const widgetId = Number(params.slug);

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (!locals.user || (locals.user && !database.layouts.hasWidget(locals.user.id, widgetId)))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	const widgetData = database.layouts.getWidget(widgetId);

	if (widgetData) {
		const parse = api.parsers[widgetData.type as keyof typeof api.parsers];

		if (!parse)
			return json({ success: false, error: 'Could not parse widget data!' }, { status: 500 });

		const apiData = await parse(widgetData);
		if (apiData) {
			return json({ success: true, api: apiData });
		}
	} else {
		return json({ success: false, error: 'Could not find widget in database!' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ locals, params }) => {
	const widgetId = Number(params.slug);

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (locals.user && !database.layouts.hasWidget(locals.user.id, widgetId))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	const widgetData = database.layouts.getWidget(widgetId);

	if (widgetData) {
		api.request(widgetData);
		return json({ success: true });
	} else {
		return json({ success: false, error: 'Could not find widget in database!' }, { status: 500 });
	}
};
