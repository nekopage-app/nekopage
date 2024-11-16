import { json, type RequestHandler } from '@sveltejs/kit';

import { UserPermission } from '$lib/enums';
import * as database from '$lib/server/database';

// Minimum three characters, maximum 32 characters, allows only letters, digits, and underscores
const usernameFilter = /^[a-zA-Z0-9_]{3,32}$/;
// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and, one special character
const passwordFilter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { username, password } = await request.json();

	if (!username || !password)
		return json({ success: false, error: "Username or password missing!" }, { status: 400 });
	if (!usernameFilter.test(username) || !passwordFilter.test(password))
		return json({ success: false, error: "Username or password filtered!" }, { status: 400 });
	if (
		!locals.user ||
		(locals.user &&
			!database.permissions.hasPermission(locals.user.id, UserPermission.Administrator))
	)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	database.auth.createUser(username, password);
	return json({ success: true });
}