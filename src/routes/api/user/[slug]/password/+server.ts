import { json, type RequestHandler } from '@sveltejs/kit';

import { UserPermission } from '$lib/enums';
import * as database from '$lib/server/database';

// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and, one special character
const passwordFilter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	const id = Number(params.slug);
	const { oldPassword, newPassword } = await request.json();

	if (!id)
        return json({ success: false, error: 'No user ID was specified!' }, { status: 400 });
	if (!newPassword)
		return json({ success: false, error: 'New password missing!' }, { status: 400 });
    if (!locals.user)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Allow administrators to change other user's passwords whilst not letting other non-administrators do the same
    const administratorCheck = locals.user.id !== id && database.permissions.hasPermission(locals.user.id, UserPermission.Administrator);
	if (!administratorCheck)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	if (!administratorCheck && !oldPassword)
		return json({ success: false, error: 'Old password missing' }, { status: 400 });
	if (!passwordFilter.test(newPassword))
		return json({ success: false, error: 'New password filtered!' }, { status: 400 });

    // If it's a non-admin user, verify their old password
	if (!administratorCheck && !await database.auth.checkUserPassword(id, oldPassword)) {
		return json({ success: false, error: 'Old password is incorrect!' }, { status: 400 });
	}

	if (await database.auth.changePassword(id, newPassword)) {
		return json({ success: true });
	} else {
		return json(
			{ success: false, error: "Something went wrong when changing the user's password" },
			{ status: 500 }
		);
	}
};
