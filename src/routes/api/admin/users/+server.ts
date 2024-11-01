import { json, type RequestHandler } from '@sveltejs/kit';

import { UserPermission } from '$lib/enums';
import * as database from '$lib/server/database';

export const GET: RequestHandler = async ({ locals }) => {
	if (
		!locals.user ||
		(locals.user &&
			!database.permissions.hasPermission(locals.user.id, UserPermission.Administrator))
	)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	return json({ success: true, users: database.auth.getUsers() });
};
