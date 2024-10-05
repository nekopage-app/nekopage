import type { Handle } from '@sveltejs/kit';
import * as database from '$lib/server/database';
import * as api from '$lib/server/api';

database.init();
api.requestAll();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get("session_id");
    
    // If session ID is found
    if (sessionId) {
        // Check it is valid
        const user = await database.auth.checkSessionId(sessionId);

        // If valid
        if (user) {
            const layout = event.cookies.get("layout");
            if (layout) {
                event.locals.layout = JSON.parse(layout);
            } else {
                event.locals.layout = null;
            }

            event.locals.user = {
                id: user.id,
                username: user.username
            };
        } else {
            // Remove session cookie
            event.cookies.delete("session_id", { path: "/" });

            // Remove session from database
            if (event.locals.user?.id)
                database.auth.removeSession(event.locals.user?.id);

            // Set user to null
            event.locals.user = null;
        }
    } else {
        // Set user to null
        event.locals.user = null;
    }

	return await resolve(event);
};