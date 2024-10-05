import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { Column } from '$lib/enums';
import * as database from '$lib/server/database';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/login");
    }

    if (locals.layout) {
        const layout = database.layouts.getParsedLayout(locals.layout.id);
        if (layout) {
            const settings = database.settings.getSettings(locals.user.id);

            return {
                layout,
                settings,
                user: locals.user
            };
        } else {
            throw redirect(303, "/login");
        }
    }
};

export const actions = {
    logout: async ({ cookies, locals }) => {
        // Delete session ID
        cookies.delete("session_id", { path: "/" });
        // Also remove it from the database
        if (locals.user?.id)
            database.auth.removeSession(locals.user.id);
        // Set user to null
        locals.user = null;

        // Redirect to login
        throw redirect(303, "/login");
    },
    moveWidget: async ({ request, locals }) => {
        // Get form data
        const data = await request.formData();
        // Widget ID
        const widgetId = Number(data.get("id"));
        // Column to add widget to
        const newColumn = data.get("column") as Column;
        // Index to add widget to
        const newIndex = Number(data.get("index"));

        if (locals.layout) {
            // Get current layout
            const layout = database.layouts.getLayout(locals.layout.id);
            const columnArray = layout[newColumn];

            // Go through each column
            Object.values(Column).forEach((column) => {
                // The old column's array
                let oldColumnArray = layout[column];

                // If widget is in old column
                if (layout[column].includes(widgetId)) {
                    // Remove widget
                    oldColumnArray = oldColumnArray.filter(id => id !== widgetId);
                    // Set old column to a new value without the now moved widget
                    database.layouts.setColumnWidgets(locals.layout!.id, column as Column, oldColumnArray);
                }
            });
            
            // Insert widget at new column
            columnArray.splice(newIndex, 0, widgetId);
            // Add widget to new column
            database.layouts.setColumnWidgets(locals.layout.id, newColumn, columnArray);
        }
    }
} satisfies Actions;