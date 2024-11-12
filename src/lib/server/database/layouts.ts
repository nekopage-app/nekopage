import { Column } from '$lib/enums';

import { database } from '.';
import * as api from "../api";

import widgetsJSON from '$lib/data/widgets.json';
const widgetsData: WidgetsJSON = widgetsJSON;

/**
 * Checks if a user has a layout in the database tied to them.
 */
export function hasLayout(userId: number, layoutId: number): boolean {
	const sql = `SELECT user_id FROM layouts WHERE id = ?`;
	const row = database.prepare(sql).get(layoutId) as DatabaseLayout;

	return userId == row.user_id;
}

/**
 * Checks if a user has a widget in the database tied to them.
 */
export function hasWidget(userId: number, widgetId: number): boolean {
	const sql = `SELECT layout_id FROM widgets WHERE id = ?`;
	const row = database.prepare(sql).get(widgetId) as DatabaseWidgetData;

	if (row) {
		const layout = getLayout(row.layout_id);
		return layout.user_id == userId;
	}

	return false;
}

/**
 * Gets all the layouts for a user.
 *
 * @param {number} userId - The user ID.
 *
 * @returns {DatabaseGetLayout[]} - The layout IDs and names found.
 */
export function getLayouts(userId: number): DatabaseGetLayout[] {
	const sql = `SELECT id, name FROM layouts WHERE user_id = ?`;
	const rows = database.prepare(sql).all(userId) as DatabaseGetLayout[];

	return rows;
}

/**
 * Gets a layout by ID and parses the properties to JSON.
 */
export function getLayout(id: number): DatabaseLayout {
	const sql = `SELECT * FROM layouts WHERE id = ?`;
	const row = database.prepare(sql).get(id) as DatabaseLayout;

	if (row) {
		row.left = JSON.parse(row.left as unknown as string);
		row.middle = JSON.parse(row.middle as unknown as string);
		row.right = JSON.parse(row.right as unknown as string);
	} else {
		throw new Error(`No layout found for id ${id}!`);
	}

	return row;
}

/**
 * Get a widget's data by specifying an ID
 */
export function getWidget(widgetId: number): WidgetData {
	const sql = `SELECT * FROM widgets WHERE id = ?`;
	const row = database.prepare(sql).get(widgetId) as DatabaseWidgetData;
	
	row.settings = JSON.parse(row.settings);
	return row as unknown as WidgetData;
}

/**
 * Returns widgets in a layout and parses the settings property to JSON.
 */
export function getWidgets(layoutId: number): WidgetData[] {
	const sql = `SELECT * FROM widgets WHERE layout_id = ?`;
	const rows = database.prepare(sql).all(layoutId) as DatabaseWidgetData[];

	rows.forEach((widget) => {
		widget.settings = JSON.parse(widget.settings);
	});

	return rows as unknown as WidgetData[];
}

/**
 * Returns every widget in the database and parses the settings property to JSON.
 */
export function getAllWidgets(): WidgetData[] {
	const sql = `SELECT * FROM widgets`;
	const rows = database.prepare(sql).all() as DatabaseWidgetData[];

	rows.forEach((widget) => {
		widget.settings = JSON.parse(widget.settings);
	});

	return rows as unknown as WidgetData[];
}

/**
 * Parses widgets and layouts into the Layout type.
 */
export function getParsedLayout(layoutId: number): Layout {
	const layout = getLayout(layoutId);
	const widgets = getWidgets(layoutId);

	const parsedLayout: Layout = {
		left: [],
		middle: [],
		right: []
	};

	Object.entries(layout).forEach(([column, ids]) => {
		// Due to `userId` being present, we check if each property is an array
		if (Array.isArray(ids)) {
			ids.forEach((id) => {
				// Find widget from id
				const widget = widgets.find((widget) => widget.id === id);

				if (widget) {
					parsedLayout[column as Column].push({
						id,
						type: widget.type,
						settings: widget.settings as WidgetSettings
					});
				}
			});
		}
	});

	return parsedLayout;
}

/**
 * Sets the widgets in a column
 */
export function setColumnWidgets(
	layoutId: number,
	column: Column,
	widgetsArray: number[]
): boolean {
	const sql = `UPDATE layouts SET ${column} = ? WHERE id = ?`;
	const row = database.prepare(sql).run(JSON.stringify(widgetsArray), layoutId);

	return row.changes > 0;
}

/**
 * Renames the specified layout
 */
export function renameLayout(layoutId: number, name: string): boolean {
	const sql = `UPDATE layouts SET name = ? WHERE id = ?`;
	const row = database.prepare(sql).run(name, layoutId);

	return row.changes > 0;
}

/**
 * Sets the widget's settings
 */
export function setWidgetSettings(widgetId: number, settings: WidgetSettings): boolean {
	const sql = `UPDATE widgets SET settings = ? WHERE id = ?`;
	const row = database.prepare(sql).run(JSON.stringify(settings), widgetId);

	return row.changes > 0;
}

/**
 * Creates a new widget with default settings
 */
export function createWidget(layoutId: number, type: string): number {
	const sql = `INSERT INTO widgets (layout_id, type, settings) VALUES (?, ?, ?)`;
	const row = database.prepare(sql).run(layoutId, type, JSON.stringify(widgetsData[type].settings));

	const id = Number(row.lastInsertRowid);

	// Make request to the widget's specified API
	api.request({
		type,
		id,
		settings: widgetsData[type].settings
	}, true);

	return id;
}

/**
 * Creates a layout
 */
export function createLayout(userId: number): boolean {
	const layouts = getLayouts(userId);

	const sql = `INSERT INTO layouts (name, user_id) VALUES (?, ?)`;
	const row = database.prepare(sql).run(`My layout #${layouts.length + 1}`, userId);

	if (row.changes > 0) {
		const layoutId = Number(row.lastInsertRowid);

		const widgetId = createWidget(layoutId, 'Text');
		setWidgetSettings(widgetId, { title: 'getting started', text: 'Welcome to nekopage!' });
		return setColumnWidgets(layoutId, Column.Left, [widgetId]);
	}

	return false;
}

/**
 * Deletes a widget in the database
 */
export function deleteWidget(widgetId: number): boolean {
	const sql = `DELETE FROM widgets WHERE id = ?`;
	const row = database.prepare(sql).run(widgetId);

	return row.changes > 0;
}