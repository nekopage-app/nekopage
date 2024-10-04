import { redirect, type Actions } from '@sveltejs/kit';
import * as database from '$lib/server/database';
import { CHROME_DESKTOP } from '$env/static/private';

export const load = async ({ locals }) => {
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

        cookies.set("layout", JSON.stringify({ id: layout.id, name: layout.name }), {
            path: "/",
            httpOnly: true,
            secure: url.protocol == "https:",
            sameSite: "strict"
        })

		throw redirect(303, '/');
	}
} satisfies Actions;
