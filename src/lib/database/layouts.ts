import { database } from '.';

/** Returns layouts for the user and parses column number arrays from string to number[] */
export function getLayouts(userId: number): DatabaseLayout[] {
	const sql = `SELECT * FROM layouts WHERE user_id = ?`;
	let rows = database.prepare(sql).all(userId) as DatabaseLayout[];

	if (rows) {
		return rows.map((layout) => {
			layout.left = JSON.parse(layout.left as unknown as string);
			layout.middle = JSON.parse(layout.middle as unknown as string);
			layout.right = JSON.parse(layout.right as unknown as string);
			return layout;
		});
	} else {
		throw new Error(`No layout found for user ID ${userId}`);
	}
}

/** Same as getLayouts() but you can specify a layout id */
export function getLayout(id: number): DatabaseLayout {
	const sql = `SELECT * FROM layouts WHERE id = ?`;
	let row = database.prepare(sql).get(id) as DatabaseLayout;

	if (row) {
		row.left = JSON.parse(row.left as unknown as string);
		row.middle = JSON.parse(row.middle as unknown as string);
		row.right = JSON.parse(row.right as unknown as string);
	} else {
		throw new Error(`No layout found for id ${id}!`);
	}

	return row;
}

/** Returns widgets found by user id and parses the settings property to JSON */
export function getWidgets(layoutId: number): DatabaseWidget[] {
	const sql = `SELECT * FROM widgets WHERE layout_id = ?`;
	let row = database.prepare(sql).all(layoutId) as DatabaseWidget[];

	row.forEach((widget) => {
		widget.settings = JSON.parse(widget.settings as string);
	});

	return row;
}

/** Combines getLayout() and getWidgets() into one while also getting rid of unused properties */
export function getParsedLayout(layoutId: number): Layout {
	const layout = getLayout(layoutId);
	const widgets = getWidgets(layoutId);

	let parsedLayout: Layout = {
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
 * Adds a widget to a layout
 *
 * @param {number} layoutId - The layout ID.
 * @param {number} widgetId - The widget ID.
 * @param {("left" | "middle" | "right")} column - The column where the widget should be placed. Valid values are "left", "middle", or "right".
 * 
 * @returns {boolean}
 * 
 * @throws {Error}
 */
export function addWidgetToLayout(layoutId: number, widgetId: number, column: 'left' | 'middle' | 'right'): boolean {
	// The SQLite library puts quotation marks around the column if I put it with the .get() function 
	const sqlSelect = `SELECT ${column} FROM layouts WHERE id = ?`;
	const sqlUpdate = `UPDATE layouts SET ${column} = ? WHERE id = ?`;
	const rowSelect = database.prepare(sqlSelect).get(layoutId) as DatabaseLayout;

	if (rowSelect) {
		let columnArray: number[] = JSON.parse(rowSelect[column].toString());
		columnArray.push(widgetId);

		const updatedColumnArray = JSON.stringify(columnArray);

		const rowUpdate = database.prepare(sqlUpdate).run(updatedColumnArray, layoutId);
		return rowUpdate.changes > 0;
	}

	return false;
}

/**
 * Creates a new widget
 *
 * @param {number} layoutId - The layout ID for the widget.
 * @param {string} name - The name of the widget.
 * @param {object} settings - The settings for the widget. Must include a `title` property with a string value. Can also include other properties.
 * 
 * @returns {number} - The ID of the newly created widget.
 * 
 * @throws {Error}
 */
export function createWidget(
	layoutId: number,
	name: string,
	settings: { title: string; [key: string]: any }
): number {
	const sql = `INSERT INTO widgets (layout_id, name, settings) VALUES (?, ?, ?)`;
	const row = database.prepare(sql).run(layoutId, name, JSON.stringify(settings));

	return Number(row.lastInsertRowid);
}

/**
 * Creates a layout
 *
 * @param {number} userId - The user ID.
 * 
 * @returns {boolean}
 * 
 * @throws {Error}
 */
export function createLayout(userId: number): boolean {
	const sql = `INSERT INTO layouts (user_id) VALUES (?)`;
	const row = database.prepare(sql).run(userId);
	
	if (row.changes > 0) {
		const layoutId = Number(row.lastInsertRowid);

		const widget = createWidget(layoutId, "Text", { title: "getting started", text: "Welcome to nekopage!" });
		return addWidgetToLayout(layoutId, widget, "left");
	}

	return false;
}
