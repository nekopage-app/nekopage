import { fail, redirect, type Actions } from "@sveltejs/kit";
import * as database from '$lib/server/database';

export const actions = {
    default: async ({ cookies, request, url }) => {
        const data = await request.formData();
        const username = data.get("username")?.toString();
        const password = data.get("password")?.toString();
        
        // Minimum three characters, maximum 32 characters, allows only letters, digits, and underscores
        const usernameFilter = /^[a-zA-Z0-9_]{3,32}$/;
        // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and, one special character
        const passwordFilter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!username || !password) {
            return fail(401, { username, success: false, missing: true });
        }

        if (!usernameFilter.test(username!) && !passwordFilter.test(password!)) {
            return fail(401, { username, success: false, incorrect: true });
        }

        const userId = await database.auth.checkUserCredentials(username, password);
        if (userId != -1) {
            const sessionId = await database.auth.generateSessionId(userId);

            cookies.set("session_id", sessionId, {
                path: "/",
                httpOnly: true,
                secure: url.protocol == "https:",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30   // 30 days
            });

            throw redirect(303, "/choose-layout");
        }

        return fail(401, { username, success: false, incorrect: true });
    }
} satisfies Actions;