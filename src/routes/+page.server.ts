import { redirect } from '@sveltejs/kit';
import * as database from '$lib/database';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/login");
    }

    const layout = database.layouts.getParsedLayout(locals.user?.id!);

    if (layout) {
        return {
            layout,
            user: locals.user
        };
    } else {
        throw redirect(303, "/login");
    }
};