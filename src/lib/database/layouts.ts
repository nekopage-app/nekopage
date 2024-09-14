import { database } from ".";

/** Returns layout for the user and parses column number arrays from string to number[] */
export function getLayout(userId: number): DatabaseLayout {
	const sql = `SELECT * FROM layouts WHERE user_id = ?`;
	let row = database.prepare(sql).get(userId) as DatabaseLayout;

	if (row) {
		row.left = JSON.parse(row.left as unknown as string);
		row.middle = JSON.parse(row.middle as unknown as string);
		row.right = JSON.parse(row.right as unknown as string);
	} else {
		throw new Error(`No layout found for user id ${userId}!`);
	}

	return row;
}

/** Returns widgets found by user id and parses the settings property to JSON */
export function getWidgets(userId: number): DatabaseWidget[] {
	const sql = `SELECT * FROM widgets WHERE user_id = ?`;
	let row = database.prepare(sql).all(userId) as DatabaseWidget[];

	row.forEach((widget) => {
		widget.settings = JSON.parse(widget.settings as string);
	});

	return row;
}

/** Combines getLayout() and getWidgets() into one while also getting rid of unused properties */
export function getParsedLayout(userId: number): Layout {
	const layout = getLayout(userId);
	const widgets = getWidgets(userId);

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