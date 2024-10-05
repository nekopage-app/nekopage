import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const PATCH: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const widgetId = Number(url.searchParams.get('id'));
    const newColumn = url.searchParams.get("column") as Column;
    const newIndex = Number(url.searchParams.get("index"));

	if (widgetId) {
		if (locals.layout) {
            // Get current layout
            const layout = database.layouts.getLayout(locals.layout.id);
            const columnArray = layout[newColumn];

            // Go through each column
            Object.values(Column).forEach((column) => {
                // The old column's array
                let oldColumnArray = layout[column];

                // If widget is in old column
                if (layout[column].includes(widgetId)) {
                    // Remove widget
                    oldColumnArray = oldColumnArray.filter(id => id !== widgetId);
                    // Set old column to a new value without the now moved widget
                    database.layouts.setColumnWidgets(locals.layout!.id, column as Column, oldColumnArray);
                }
            });
            
            // Insert widget at new column
            columnArray.splice(newIndex, 0, widgetId);
            // Add widget to new column
            database.layouts.setColumnWidgets(locals.layout.id, newColumn, columnArray);

            return json({ success: true });
        } else {
            return json({ success: false, error: 'No layout was found' }, { status: 400 });
        }
	} else {
        return json({ success: false, error: 'No widget ID was found' }, { status: 400 });
    }
};
