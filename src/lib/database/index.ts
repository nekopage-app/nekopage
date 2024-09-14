import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";

export const database = new Database(env.DATABASE_PATH);

export * as auth from "./auth";
export * as layouts from "./layouts";

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

	// Widgets
	database.exec(`
		CREATE TABLE IF NOT EXISTS "widgets" (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"user_id" INTEGER NOT NULL,
			"column" VARCHAR(6) NOT NULL DEFAULT 'left',
			"name" VARCHAR(32) NOT NULL,
			"settings" TEXT NOT NULL DEFAULT '{"title":""}',
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);

	// Layouts
	database.exec(`
		CREATE TABLE IF NOT EXISTS "layouts" (
			"user_id" INTEGER NOT NULL,
			"left" TEXT NOT NULL DEFAULT '[]',
			"middle" TEXT NOT NULL DEFAULT '[]',
			"right" TEXT NOT NULL DEFAULT '[]',
			PRIMARY KEY ("user_id"),
			FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
		);
	`);
}