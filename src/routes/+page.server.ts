import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import * as database from '$lib/server/database';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/login");
    }

    if (locals.layout) {
        const layout = database.layouts.getParsedLayout(locals.layout.id);
        if (layout) {
            const settings = database.settings.getSettings(locals.user.id);
            const permissions = database.permissions.getPermissions(locals.user.id);

            return {
                layout,
                settings,
                permissions,
                user: locals.user
            };
        } else {
            throw redirect(303, "/login");
        }
    }
};

export const actions = {
    logout: async ({ cookies, locals }) => {
        // Delete session ID
        cookies.delete("session_id", { path: "/" });
        // Also remove it from the database
        if (locals.user?.id)
            database.auth.removeSession(locals.user.id);
        // Set user to null
        locals.user = null;

        // Redirect to login
        throw redirect(303, "/login");
    }
} satisfies Actions;