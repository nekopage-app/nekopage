import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const DELETE: RequestHandler = async ({ locals, url }) => {
	const widgetId = Number(url.searchParams.get('id'));

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was specified' }, { status: 400 });
	if (!locals.layout)
		return json({ success: false, error: 'No layout was found' }, { status: 400 });
	if (locals.user && !database.layouts.hasLayout(locals.user.id, locals.layout.id))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	// Get current layout
	const layout = database.layouts.getLayout(locals.layout.id);

	// Go through each column and remove the widget if found
	for (const column of Object.values(Column)) {
		let columnArray = layout[column];

		if (layout[column].includes(widgetId)) {
			// Remove the widget and update column
			columnArray = columnArray.filter((id) => id !== widgetId);
			database.layouts.setColumnWidgets(locals.layout!.id, column, columnArray);
			database.layouts.deleteWidget(widgetId);

			return json({ success: true, column });
		}
	}

	return json({ success: false, error: 'No widget was found' }, { status: 500 });
};
