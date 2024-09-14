import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";

import * as auth from "./auth";
import * as layouts from "./layouts";

export const database = new Database(env.DATABASE_PATH);

export { auth, layouts };

/** Initalize database - adds tables if not found */
export function init() {
	// Users
	database.exec(`
		CREATE TABLE IF NOT EXISTS "users" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"username" VARCHAR(32) NOT NULL UNIQUE,
			"password" TEXT NOT NULL
		);
	`);

	// Layouts
	database.exec(`
		CREATE TABLE IF NOT EXISTS "layouts" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"user_id" INTEGER NOT NULL,
			"left" TEXT NOT NULL DEFAULT '[]',
			"middle" TEXT NOT NULL DEFAULT '[]',
			"right" TEXT NOT NULL DEFAULT '[]',
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);

	// Widgets
	database.exec(`
		CREATE TABLE IF NOT EXISTS "widgets" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"layout_id" INTEGER NOT NULL,
			"name" VARCHAR(32) NOT NULL,
			"settings" TEXT NOT NULL DEFAULT '{"title":""}',
			FOREIGN KEY ("layout_id") REFERENCES "layouts"("id") ON DELETE CASCADE
		);
	`);

	console.info("Checked and created missing tables in database");

    // Create default user
	const userCountSql = `SELECT COUNT(*) FROM users`;
	const userCount = database.prepare(userCountSql).get();

	if (userCount === 0) {
		auth.createUser("neko", "meow");
		console.info("Default account created");
	}
}