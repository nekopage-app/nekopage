import { json, type RequestHandler } from '@sveltejs/kit';

import * as database from '$lib/server/database';

export const PATCH: RequestHandler = async ({ locals, params, url }) => {
	const layoutId = Number(params.slug);
	const newName = url.searchParams.get('name');

	if (!layoutId)
		return json({ success: false, error: 'No layout ID was specified' }, { status: 400 });
	if (!newName)
		return json({ success: false, error: 'No new name for the layout was specified' }, { status: 400 });
	if (!locals.user)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	if (!database.layouts.renameLayout(layoutId, newName)) {
        return json({ success: false, error: 'Renaming layout failed!' }, { status: 500 });
    } else {
        return json({ success: true });
    }
};