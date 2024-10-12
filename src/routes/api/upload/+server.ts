import { json, type RequestHandler } from '@sveltejs/kit';
import * as database from '$lib/server/database';

export const POST: RequestHandler = async ({ request, locals }) => {
    const data = await request.formData();
	const file = data.get('file') as File;

    if (!locals.user)
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!file)
        return json({ success: false, error: "No file was found" }, { status: 401 });

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const uploadedImage = await database.uploads.uploadImage(locals.user.id, inputBuffer);

    if (uploadedImage) {
        return json({ success: true, file: uploadedImage });
    } else {
        return json({ success: false, error: "File was not uploaded" }, { status: 500 });
    }
};
