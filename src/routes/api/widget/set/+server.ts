import { json, type RequestHandler } from '@sveltejs/kit';

import * as database from '$lib/server/database';

export const PATCH: RequestHandler = async ({ locals, url }) => {
	const widgetId = Number(url.searchParams.get('id'));
	const settings = url.searchParams.get('settings');

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (!settings)
		return json({ success: false, error: 'No settings were specified' }, { status: 400 });
	if (!locals.layout)
		return json({ success: false, error: 'No layout was found' }, { status: 400 });
	if (locals.user && !database.layouts.hasLayout(locals.user.id, locals.layout.id))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	database.layouts.setWidgetSettings(widgetId, JSON.parse(settings));
	return json({ success: true });
};
