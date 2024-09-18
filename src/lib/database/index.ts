import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";

import * as auth from "./auth";
import * as layouts from "./layouts";
import * as settings from "./settings";

export const database = new Database(env.DATABASE_PATH, { verbose: console.log });

export { auth, layouts, settings };

/** Initalize database - adds tables if not found */
export function init() {
	// Users
	database.exec(`
		CREATE TABLE IF NOT EXISTS "users" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"username" VARCHAR(32) NOT NULL UNIQUE,
			"password" TEXT NOT NULL,
			session_id TEXT,
			session_created DATETIME
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

	// Settings
	database.exec(`
		CREATE TABLE IF NOT EXISTS "settings" (
			"user_id" INTEGER NOT NULL,
			"setting_key" VARCHAR(255) NOT NULL,
			"setting_value" TEXT,
			PRIMARY KEY ("user_id", "setting_key")
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);

	console.info("Checked and created missing tables in database");

    // Create default user
	const userCountSql = `SELECT COUNT(*) FROM users`;
	const userCountResult = database.prepare(userCountSql).get() as any;

	if (userCountResult["COUNT(*)"] === 0) {
		auth.createUser("neko", "meow");
		console.info("Default account created");
	}

	// const widget = layouts.createWidget(1, "Search", {title: "search", url: "https://www.google.com/search?q="});
	// layouts.addWidgetToLayout(1, widget, "middle");
}