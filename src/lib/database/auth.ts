import argon2 from "argon2";

import { database, layouts } from ".";

/** Checks if password is correct by verifying hash */
export async function checkUserCredentials(username: string, password: string): Promise<boolean> {
	const sql = `SELECT * FROM users WHERE username = ?`;
	const row = database.prepare(sql).get(username) as DatabaseUser;

	if (row) {
		return await argon2.verify(row.password, password);
	}

	return false;
}

/**
 * Creates a new user with a hashed password.
 *
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user in plain text.
 * 
 * @returns {Promise<number>} - The ID for the new user.
 * 
 * @throws {Error}
 */
export async function createUser(username: string, password: string): Promise<number> {
	try {
		const hashedPassword = await argon2.hash(password);

		const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
		const row = database.prepare(sql).run(username, hashedPassword);
		const userId = Number(row.lastInsertRowid);

		layouts.createLayout(userId);

		return userId;
	} catch (error) {
		throw new Error(`Unable to create user: ${error}`);
	}
}