import type { Handle } from '@sveltejs/kit';
import * as database from '$lib/server/database';
import * as api from '$lib/server/api';

database.init();
api.requestAll();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get("session_id");
	const user = await database.auth.checkSessionId(sessionId!);
	
	if (user) {
		event.locals.layoutId = await database.layouts.getLayouts(user.id)[0];
		event.locals.user = {
			id: user.id,
			username: user.username
		};
	} else {
		event.locals.user = null;
	}

	return await resolve(event);
};