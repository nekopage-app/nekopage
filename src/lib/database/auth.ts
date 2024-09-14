import argon2 from "argon2";

import { database } from ".";

/** Checks if password is correct by verifying hash */
export async function checkUser(username: string, password: string): Promise<boolean> {
	const sql = `SELECT * FROM users WHERE username = ?`;
	const row = database.prepare(sql).get(username) as DatabaseUser;

	if (row) {
		return await argon2.verify(row.password, password);
	}

	return false;
}