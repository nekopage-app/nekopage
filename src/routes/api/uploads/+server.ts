import { json, type RequestHandler } from '@sveltejs/kit';
import * as database from '$lib/server/database';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });

	return json({ success: true, uploads: database.uploads.getUploads(locals.user!.id) });
};
