import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

import { ensureSessionValid } from "@atcast/atproto";
import { SESSION_TOKEN } from "@atcast/lib";
import { db } from "@atcast/models";

import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";

export function getSessionFromRequest(req: NextRequest) {
    return getSession(req.headers, req.cookies);
}

export const getSessionFromRuntime = cache(async () => {
    return getSession(await headers(), await cookies());
});

export async function getSession(
    headers: Headers | ReadonlyHeaders,
    cookies: RequestCookies | ReadonlyRequestCookies,
) {
    if (!headers.has("authorization") && !cookies.has(SESSION_TOKEN)) {
        return {
            errorResponse: new AtprotoErrorResponse(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                },
            ),
        };
    }

    const authHeader = headers.get("authorization");
    const tokenCookie = cookies.get(SESSION_TOKEN);

    let token: string | undefined = undefined;

    if (authHeader) {
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
            return {
                errorResponse: new AtprotoErrorResponse(
                    {
                        error: "InvalidToken",
                    },
                    {
                        status: 400,
                    },
                ),
            };
        }

        token = parts[1];
    } else if (tokenCookie) {
        token = tokenCookie.value;
    } else {
        return {
            errorResponse: new AtprotoErrorResponse(
                {
                    error: "Unauthorized",
                },
                {
                    status: 400,
                },
            ),
        };
    }

    if (!token) {
        return {
            errorResponse: new AtprotoErrorResponse(
                {
                    error: "InvalidToken",
                },
                {
                    status: 400,
                },
            ),
        };
    }

    let session = await db.query.userSessions.findFirst({
        where: (userSessions, { eq }) => eq(userSessions.token, token),
    });

    if (!session) {
        return {
            errorResponse: new AtprotoErrorResponse(
                {
                    error: "InvalidToken",
                },
                {
                    status: 401,
                },
            ),
        };
    }

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session!.userId),
    });

    session = await ensureSessionValid(session, {
        metadata: await getBskyAuthInfo(),
    });

    return {
        session,
        user: user!,
    };
}
