import { json, type RequestHandler } from '@sveltejs/kit';
import * as api from '$lib/server/api';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const widgetId = Number(url.searchParams.get('id'));

	if (widgetId) {
		return json(api.responses[widgetId]);
	} else {
		return json({ success: false, error: 'No widget ID was found' }, { status: 400 });
	}
};
