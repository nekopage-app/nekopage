import { Column } from '$lib/enums';

import { database } from '.';
import * as api from "../api";

import default_widget_settings_json from '$lib/data/default_widget_settings.json';
const default_widget_settings: { [key: string]: WidgetSettings } = default_widget_settings_json;

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
 *
 * @param {number} layoutId - The layout ID.
 *
 * @returns {DatabaseLayout}
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
 * Checks if a user has a layout in the database tied to them.
 *
 * @param {number} userId - The user ID.
 * @param {number} layoutId - The layout ID.
 *
 * @returns {boolean}
 */
export function hasLayout(userId: number, layoutId: number): boolean {
	const sql = `SELECT user_id FROM layouts WHERE id = ?`;
	const row = database.prepare(sql).get(layoutId) as DatabaseLayout;

	return !!row.user_id;
}

/**
 * Checks if a user has a widget in the database tied to them.
 *
 * @param {number} userId - The user ID.
 * @param {number} widgetId - The widget ID.
 *
 * @returns {boolean}
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
 * Returns widgets in a layout and parses the settings property to JSON.
 *
 * @param {number} layoutId - The layout ID.
 *
 * @returns {WidgetData[]}
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
 *
 * @returns {WidgetData[]}
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
 *
 * @param {number} layoutId - The layout ID.
 *
 * @returns {Layout}
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
					parsedLayout[column].push({
						id,
						name: widget.name,
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
 *
 * @param {number} layoutId - The layout ID.
 * @param {Column} column - The column for the widget IDs to be set to.
 * @param {number[]} widgetsArray - The array of widget IDs.
 *
 * @returns {boolean}
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
 *
 * @param {number} layoutId - The layout ID.
 * @param {string} name - The new name for the layout.
 *
 * @returns {boolean}
 */
export function renameLayout(layoutId: number, name: string): boolean {
	const sql = `UPDATE layouts SET name = ? WHERE id = ?`;
	const row = database.prepare(sql).run(name, layoutId);

	return row.changes > 0;
}

/**
 * Sets the widget's settings
 *
 * @param {number} widgetId - The widget ID.
 * @param {WidgetSettings} settings - The new settings for the widget.
 *
 * @returns {boolean}
 */
export function setWidgetSettings(widgetId: number, settings: WidgetSettings): boolean {
	const sql = `UPDATE widgets SET settings = ? WHERE id = ?`;
	const row = database.prepare(sql).run(JSON.stringify(settings), widgetId);

	return row.changes > 0;
}

/**
 * Creates a new widget with default settings
 *
 * @param {number} layoutId - The layout ID for the widget.
 * @param {string} name - The name of the widget.
 *
 * @returns {number} - The ID of the newly created widget.
 */
export function createWidget(layoutId: number, name: string): number {
	const sql = `INSERT INTO widgets (layout_id, name, settings) VALUES (?, ?, ?)`;
	const row = database.prepare(sql).run(layoutId, name, JSON.stringify(default_widget_settings[name]));

	const id = Number(row.lastInsertRowid);

	// Make request to the widget's specified API
	api.request({
		name,
		id,
		settings: default_widget_settings[name]
	});

	return id;
}

/**
 * Creates a layout
 *
 * @param {number} userId - The user ID.
 *
 * @returns {boolean}
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
 *
 * @param {number} widgetId - The ID of the widget to be deleted.
 *
 * @returns {boolean}
 */
export function deleteWidget(widgetId: number): boolean {
	const sql = `DELETE FROM widgets WHERE id = ?`;
	const row = database.prepare(sql).run(widgetId);

	return row.changes > 0;
}