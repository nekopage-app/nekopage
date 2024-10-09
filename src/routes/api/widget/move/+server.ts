import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const PATCH: RequestHandler = async ({ locals, url }) => {
	const widgetId = Number(url.searchParams.get('id'));
	const newColumn = url.searchParams.get('column') as Column;
	const newIndex = Number(url.searchParams.get('index'));

	if (!widgetId)
		return json({ success: false, error: 'No widget ID was was specified' }, { status: 400 });
	if (!newColumn)
		return json({ success: false, error: 'No column was specified' }, { status: 400 });
	if (newIndex == null)
		return json({ success: false, error: 'No column index was specified' }, { status: 400 });
	if (!locals.layout)
		return json({ success: false, error: 'No layout was found' }, { status: 400 });
	if (locals.user && !database.layouts.hasLayout(locals.user.id, locals.layout.id))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	// Get current layout
	const layout = database.layouts.getLayout(locals.layout.id);
	const columnArray = layout[newColumn];

	// Go through each column and remove the old widget
	Object.values(Column).forEach((column) => {
		let oldColumnArray = layout[column];

		if (layout[column].includes(widgetId)) {
			// Remove the widget and update column
			oldColumnArray = oldColumnArray.filter((id) => id !== widgetId);
			database.layouts.setColumnWidgets(locals.layout!.id, column as Column, oldColumnArray);
		}
	});

	// Insert widget at new column
	columnArray.splice(newIndex, 0, widgetId);
	database.layouts.setColumnWidgets(locals.layout.id, newColumn, columnArray);

	return json({ success: true });
};
