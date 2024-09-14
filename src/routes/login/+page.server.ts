import { fail, redirect, type Actions } from "@sveltejs/kit";
import * as database from '$lib/database';

export const actions = {
    default: async ({ cookies, request }) => {
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

        if (await database.auth.checkUserCredentials(username, password)) {
            cookies.set("session_id", "TODO_SESSION_ID", {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30
            });

            throw redirect(303, "/");
        }

        return fail(401, { username, success: false, incorrect: true });
    }
} satisfies Actions;