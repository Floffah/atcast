"use server";

import { eq } from "drizzle-orm";
import { cookies as nextCookies } from "next/headers";

import { SESSION_TOKEN } from "@atcast/lib";
import { db, userSessions } from "@atcast/models";

export async function logout() {
    "use server";

    const cookies = await nextCookies();

    if (cookies.has(SESSION_TOKEN)) {
        const token = cookies.get(SESSION_TOKEN)!;

        await db
            .delete(userSessions)
            .where(eq(userSessions.token, token.value));

        cookies.delete(SESSION_TOKEN);

        return {
            success: true,
        };
    }

    return {
        success: false,
    };
}
