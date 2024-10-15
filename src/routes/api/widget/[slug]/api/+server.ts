import { json, type RequestHandler } from '@sveltejs/kit';

import * as api from '$lib/server/api';
import * as database from '$lib/server/database';

export const GET: RequestHandler = async ({ locals, params }) => {
	const widgetId = Number(params.slug);

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (locals.user && !database.layouts.hasWidget(locals.user.id, widgetId))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	// Return API responses tied to the widget ID
	return json({ success: true, api: api.responses[widgetId] });
};

export const PUT: RequestHandler = async ({ locals, params, url }) => {
	const widgetId = Number(params.slug);
	const dataParam = url.searchParams.get('data');

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (!dataParam)
		return json({ success: false, error: 'No widget data was specified' }, { status: 400 });
	if (!locals.layout)
		return json({ success: false, error: 'No layout was found' }, { status: 400 });
	if (
		locals.user &&
		!database.layouts.hasLayout(locals.user.id, locals.layout.id) &&
		!database.layouts.hasWidget(locals.user.id, widgetId)
	)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	const data = JSON.parse(dataParam) as WidgetData;
	if (!data)
		return json({ success: false, error: 'The widget data specified is invalid' }, { status: 400 });

	api.request(data);
	return json({ success: true });
};