import { redirect, type Actions } from '@sveltejs/kit';
import * as database from '$lib/database';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/login");
    }

    const layout = database.layouts.getParsedLayout(locals.layoutId!);

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
};

export const actions = {
    logout: async ({ cookies, locals }) => {
        cookies.delete("session_id", { path: "/" });
        locals.user = null;

        throw redirect(303, "/login");
    },
    addWidget: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get("name") as string;

        const layout = database.layouts.getLayout(locals.layoutId!);
        const widgetId = database.layouts.createWidget(locals.layoutId!, name, { title: name.toLocaleLowerCase() });
        database.layouts.setColumnWidgets(locals.layoutId!, "left", [...layout.left, widgetId]);

        return widgetId;
    },
    moveWidget: async ({ request, locals }) => {
        const data = await request.formData();

        const id = Number(data.get("id"));
        const index = Number(data.get("index"));
        const oldColumn = data.get("oldColumn") as Column;
        const column = data.get("column") as Column;

        const layout = database.layouts.getLayout(locals.layoutId!);
        let oldColumnArray = layout[oldColumn];
        let newColumnArray = layout[column];
        
        const oldColumnIndex = oldColumnArray.indexOf(id);
        if (oldColumnIndex !== -1) {
            oldColumnArray.splice(oldColumnIndex, 1);
        }

        newColumnArray.splice(index, 0, id);
        database.layouts.setColumnWidgets(locals.layoutId!, column, newColumnArray);
    }
} satisfies Actions;