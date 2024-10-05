import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const POST: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const widgetName = url.searchParams.get('name');

	if (widgetName) {
        if (locals.layout) {
            // Get current layout
            const layout = database.layouts.getLayout(locals.layout.id);
    
            // Create widget
            const widgetId = database.layouts.createWidget(locals.layout.id!, widgetName);
            // Add widget to the left column
            database.layouts.setColumnWidgets(locals.layout.id!, Column.Left, [...layout.left, widgetId]);
    
            return json({ success: true, id: widgetId });
        } else {
            return json({ success: false, error: 'No layout was found' }, { status: 400 });
        }
    } else {
        return json({ success: false, error: 'No widget name was found' }, { status: 400 });
    }
};
