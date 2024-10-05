import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const DELETE: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const widgetId = Number(url.searchParams.get('id'));

	if (widgetId) {
		if (locals.layout) {
            // Get current layout
            const layout = database.layouts.getLayout(locals.layout.id);

            // Go through each column
            for (const column of Object.values(Column)) {
                // The column's array
                let columnArray = layout[column];

                // If widget is in column
                if (layout[column].includes(widgetId)) {
                    // Remove widget
                    columnArray = columnArray.filter(id => id !== widgetId);
                    // Set column to a new value without the now deleted widget
                    database.layouts.setColumnWidgets(locals.layout!.id, column, columnArray);
                    // Delete the widget from the database
                    database.layouts.deleteWidget(widgetId);

                    return json({ success: true, column });
                }
            }

            return json({ success: false, error: "No widget was found" }, { status: 500 });
        } else {
            return json({ success: false, error: 'No layout was found' }, { status: 400 });
        }
	} else {
        return json({ success: false, error: 'No widget ID was found' }, { status: 400 });
    }
};
