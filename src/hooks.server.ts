import type { Handle } from '@sveltejs/kit';
import * as database from '$lib/database';

database.init();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get("session_id");

	if (sessionId) {
		// todo: set locals to user information from database

		event.locals.user = {
			id: 1,
			username: "admin"
		}
	} else {
		event.locals.user = null;
	}

	return await resolve(event);
};