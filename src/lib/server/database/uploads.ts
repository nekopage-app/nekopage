import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';

import { database } from '.';

/**
 * Gets all of the uploads tied to a user
 */
export function getUploads(userId: number): string[] {
    const sql = `SELECT file FROM uploads WHERE user_id = ?`;
	const rows = database.prepare(sql).all(userId) as { file: string }[];

    const files = rows.map(row => row.file);
	return files;
}

/**
 * Uploads an image, compresses it, generates a file name, and keeps a record of it in the database
 *
 * @returns The new file name. Returns false if not uploaded.
 */
export async function uploadImage(userId: number, buffer: Buffer): Promise<string | boolean> {
    try {
		// Compress image
		const newBuffer = await sharp(buffer).webp().toBuffer();
		// Generate file name
		const fileName = crypto.randomBytes(16).toString('hex');

		// Write it to the uploads folder
		await fs.writeFile(`static/uploads/${fileName}.webp`, newBuffer);

		// Assign user to the uploaded file
		const sql = `INSERT INTO uploads (user_id, file) VALUES (?, ?)`;
		database.prepare(sql).run(userId, fileName);

		return fileName;
	} catch (error) {
		console.error(`[database]: error while processing image: ${error}`);
        return false;
	}
}
