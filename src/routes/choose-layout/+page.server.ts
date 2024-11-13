import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import * as database from '$lib/server/database';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const layouts = database.layouts.getLayouts(locals.user.id);

	return {
		layouts,
		user: locals.user
	};
};

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		const layout = database.layouts.getLayout(id);
		if (!layout) throw redirect(500, '/login');

        cookies.set("layout", JSON.stringify({ id: layout.id, name: layout.name }), {
            path: "/",
            httpOnly: true,
            secure: url.protocol == "https:",
            sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30   // 30 days
        })

		throw redirect(303, '/');
	}
} satisfies Actions;
