import { json, type RequestHandler } from '@sveltejs/kit';

import * as api from '$lib/server/api';
import * as database from '$lib/server/database';

export const PATCH: RequestHandler = async ({ locals, params, url }) => {
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

	api.request(data, true);
	database.layouts.setWidgetSettings(data.id, data.settings);
	return json({ success: true });
};
