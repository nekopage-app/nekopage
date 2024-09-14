import { redirect } from '@sveltejs/kit';
import * as database from '$lib/database';

export const load = async ({ cookies, locals }) => {
    const sessionId = cookies.get("session_id");

    // todo: verify session id is correct
    if (!sessionId) {
        throw redirect(303, "/login");
    }

    return {
		layout: database.layouts.getParsedLayout(locals.user?.id!),
        user: locals.user
	};
};