import { json, type RequestHandler } from '@sveltejs/kit';

import * as database from '$lib/server/database';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	const layout = database.layouts.createLayout(locals.user.id);
    if (layout) {
        return json({ success: true, id: layout.id, name: layout.name });
    } else {
        return json({ success: false, error: 'Failed to create layout' }, { status: 500 });
    }
};