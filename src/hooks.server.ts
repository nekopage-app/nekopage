import type { Handle } from '@sveltejs/kit';
import * as database from '$lib/database';

database.init();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get("session_id");
	const user = await database.auth.checkSessionId(sessionId!);
	
	if (user) {
		event.locals.user = {
			id: user.id,
			username: user.username
		};
	} else {
		event.locals.user = null;
	}

	return await resolve(event);
};