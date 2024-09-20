import { json, type RequestHandler } from "@sveltejs/kit";

import * as database from "$lib/server/database";
import * as api from "$lib/server/api";

export const GET: RequestHandler = async ({ request, url }) => {
    const cookie = request.headers.get("cookie");

    if (cookie) {
        if (await database.auth.checkSessionId(cookie.split("session_id=")[1])) {
            const widgetId = Number(url.searchParams.get("widgetId"));

            if (widgetId) {
                return json(api.responses[widgetId]);
            }

            return json({ success: false, error: "No widget ID was found" }, { status: 400 });
        }
    }

    return json({ success: false, error: "Unauthorized" }, { status: 401 });
};