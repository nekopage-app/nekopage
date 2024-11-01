import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const POST: RequestHandler = async ({ locals, url }) => {
	const widgetType = url.searchParams.get('type');

	if (!widgetType)
		return json({ success: false, error: 'No widget type was specified' }, { status: 400 });
	if (!locals.layout)
		return json({ success: false, error: 'No layout was found' }, { status: 400 });
	if (
		!locals.user ||
		(locals.user && !database.layouts.hasLayout(locals.user.id, locals.layout.id))
	)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	// Get current layout and create widget
	const layout = database.layouts.getLayout(locals.layout.id);
	const widgetId = database.layouts.createWidget(locals.layout.id!, widgetType);

	// Add widget to the left column
	database.layouts.setColumnWidgets(locals.layout.id!, Column.Left, [...layout.left, widgetId]);

	return json({ success: true, id: widgetId });
};
