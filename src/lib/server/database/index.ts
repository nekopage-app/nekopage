import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";

import * as auth from "./auth";
import * as layouts from "./layouts";
import * as settings from "./settings";
import * as uploads from "./uploads";
import * as permissions from "./permissions";
import { UserPermission } from "$lib/enums";

export const database = new Database(env.DATABASE_PATH ?? "./nekopage.db", { verbose: console.log });

export { auth, layouts, settings, uploads, permissions };

/**
 * Initalize database - adds tables if not found
 */
export async function init() {
	// Users
	database.exec(`
		CREATE TABLE IF NOT EXISTS "users" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"username" VARCHAR(32) NOT NULL UNIQUE,
			"password" TEXT NOT NULL,
			"session_id" TEXT,
			"session_created" DATETIME
		);
	`);

	// Permissions
	database.exec(`
		CREATE TABLE IF NOT EXISTS "permissions" (
			"user_id" INTEGER NOT NULL UNIQUE,
			"permission" VARCHAR(64) NOT NULL UNIQUE,
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);

	// Layouts
	database.exec(`
		CREATE TABLE IF NOT EXISTS "layouts" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"name" VARCHAR(32),
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
			"type" VARCHAR(32) NOT NULL,
			"settings" TEXT NOT NULL DEFAULT '{"title":""}',
			FOREIGN KEY ("layout_id") REFERENCES "layouts"("id") ON DELETE CASCADE
		);
	`);

	// Settings
	database.exec(`
		CREATE TABLE IF NOT EXISTS "settings" (
			"user_id" INTEGER NOT NULL,
			"key" VARCHAR(255) NOT NULL,
			"value" TEXT,
			PRIMARY KEY ("key")
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);

	// Uploads
	database.exec(`
		CREATE TABLE IF NOT EXISTS "uploads" (
			"user_id" INTEGER NOT NULL,
			"file" VARCHAR(255) NOT NULL,
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);

	console.info("[database]: checked and created missing tables in database");

    // Create default user
	const userCountSql = `SELECT COUNT(*) FROM users`;
	const userCountResult = database.prepare(userCountSql).get() as any;

	if (userCountResult["COUNT(*)"] === 0) {
		const userId = await auth.createUser("neko", "meow");
		permissions.addPermission(userId, UserPermission.Administrator);

		console.info("[database]: default account created");
	}
}