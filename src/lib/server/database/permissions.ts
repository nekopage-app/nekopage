import { UserPermission } from '$lib/enums';

import { database } from '.';

/**
 * Checks if a user has permission to do something.
 */
export function hasPermission(userId: number, permission: UserPermission): boolean {
	// If a user is administrator, they will have all the permissions automatically
	if (permission != UserPermission.Administrator)
		if (hasPermission(userId, UserPermission.Administrator)) return true;

	const sql = `SELECT 1 FROM permissions WHERE user_id = ? AND permission = ?`;
	const row = database.prepare(sql).get(userId, permission);

	return row !== undefined;
}

/**
 * Get permissions for a user.
 */
export function getPermissions(userId: number): UserPermission[] {
	const sql = `SELECT * FROM permissions WHERE user_id = ?`;
	const rows = database.prepare(sql).all(userId) as DatabasePermission[];

	const permissions = rows
		.filter((row) => Object.values(UserPermission).includes(row.permission as UserPermission))
		.map((row) => row.permission as UserPermission);
	return permissions;
}

/**
 * Adds a permission to a user.
 */
export function addPermission(userId: number, permission: UserPermission): boolean {
	const sql = `INSERT INTO permissions (user_id, permission) VALUES (?, ?)`;
	const row = database.prepare(sql).run(userId, permission);

	return row.changes > 0;
}

/**
 * Deletes a permission from a user.
 */
export function deletePermission(userId: number, permission: UserPermission): boolean {
	const sql = `DELETE FROM permissions WHERE user_id = ? AND permission = ?`;
	const row = database.prepare(sql).run(userId, permission);

	return row.changes > 0;
}
