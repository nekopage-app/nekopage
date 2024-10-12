import { json, type RequestHandler } from '@sveltejs/kit';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const PATCH: RequestHandler = async ({ locals, url }) => {
	const column = url.searchParams.get('column') as Column;
	const widgetsArray = url.searchParams.get('widgets');

	if (!locals.layout)
		return json({ success: false, error: 'No layout was found' }, { status: 400 });
	if (locals.user && !database.layouts.hasLayout(locals.user.id, locals.layout.id))
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	if (!column)
		return json({ success: false, error: 'No column was specified' }, { status: 400 });
	if (!widgetsArray)
		return json({ success: false, error: 'No widgets were specified' }, { status: 400 });

	database.layouts.setColumnWidgets(locals.layout.id, column, JSON.parse(widgetsArray));
	return json({ success: true });
};
