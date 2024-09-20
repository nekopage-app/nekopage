import argon2 from "argon2";
import crypto from "crypto";

import { database, layouts } from ".";

/**
 * Checks if a user's credentials are correct by verifying the hash.
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * 
 * @returns {Promise<number>} - The ID for the user.
 */
export async function checkUserCredentials(username: string, password: string): Promise<number> {
	const sql = `SELECT * FROM users WHERE username = ?`;
	const row = database.prepare(sql).get(username) as DatabaseUser;

	if (row) {
		if (await argon2.verify(row.password, password)) {
			return row.id;
		}
	}

	return -1;
}

/**
 * Checks if a user's session ID is correct by verifying the hash and checking if it is expired.
 *
 * @param {string} sessionId - The session ID in plain text.
 * 
 * @returns {Promise<DatabaseUser | null>}
 */
export async function checkSessionId(sessionId: string): Promise<DatabaseUser | null> {
	if (sessionId) {
		const sql = `SELECT * FROM users WHERE session_id IS NOT NULL AND session_created IS NOT NULL`;
		const rows = database.prepare(sql).all() as DatabaseUser[];

		for (const user of rows) {
			if (await argon2.verify(user.session_id, sessionId)) {
				const sessionCreated = new Date(user.session_created);
				const now = new Date();
				const expirationDate = new Date(sessionCreated.getTime() + 30 * 24 * 60 * 60 * 1000);	// 30 days

				if (now <= expirationDate) {
					return user;
				}
			}
		}
	}

	return null;
}

/**
 * Generates a session id and hashes it.
 *
 * @param {number} userId - The user ID.
 * 
 * @returns {Promise<string>} - The plain text session ID.
 * 
 * @throws {Error}
 */
export async function generateSessionId(userId: number): Promise<string> {
	const sessionId = crypto.randomBytes(32).toString("hex");
	const hash = await argon2.hash(sessionId);

	const sql = `UPDATE users SET session_id = ?, session_created = CURRENT_TIMESTAMP WHERE id = ?`;
	const row = database.prepare(sql).run(hash, userId);

	if (row.changes > 0) {
        return sessionId;
    }

	throw new Error("Failed to generate and store session ID");
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