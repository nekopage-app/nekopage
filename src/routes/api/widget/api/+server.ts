import { json, type RequestHandler } from '@sveltejs/kit';
import * as api from '$lib/server/api';
import * as database from '$lib/server/database';

export const GET: RequestHandler = async ({ locals, url }) => {
	const widgetId = Number(url.searchParams.get('id'));

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (locals.user && !database.layouts.hasWidget(locals.user.id, widgetId))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	// Return API responses tied to the widget ID
	return json({ success: true, api: api.responses[widgetId] });
};
