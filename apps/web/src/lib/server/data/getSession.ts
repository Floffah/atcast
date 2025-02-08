import { JoseKey } from "@atproto/jwk-jose";
import { eq } from "drizzle-orm";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

import { createDPoPFetch, getClientId } from "@atcast/atproto";
import { SESSION_TOKEN } from "@atcast/lib";
import { db, userSessions } from "@atcast/models";

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

    if (
        session.accessTokenExpiresAt &&
        session.accessTokenExpiresAt < new Date()
    ) {
        const key = await JoseKey.fromJWK(session.jwk as any);
        const bskyOauthSpec = await getBskyAuthInfo();

        const dpopFetch = createDPoPFetch({
            key,
            metadata: bskyOauthSpec,
        });

        const refreshResponse = await dpopFetch(bskyOauthSpec.token_endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: getClientId(),
                grant_type: "refresh_token",
                refresh_token: session.refreshToken,
            }),
        });
        const refreshData = await refreshResponse.json();

        if (refreshData.error) {
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

        const insertResult = await db
            .update(userSessions)
            .set({
                accessToken: refreshData.access_token,
                accessTokenExpiresAt: new Date(
                    Date.now() + refreshData.expires_in * 1000,
                ),
                refreshToken: refreshData.refresh_token,
                accessTokenType: refreshData.token_type,
            })
            .where(eq(userSessions.id, session.id))
            .returning();

        if (!insertResult) {
            throw new Error("Failed to update session");
        }

        session = insertResult[0];
    }

    return {
        session,
        user: user!,
    };
}
