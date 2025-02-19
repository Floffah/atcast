import { AtUri } from "@atproto/api";
import { JoseKey } from "@atproto/jwk-jose";
import { addDays, addSeconds } from "date-fns";
import { and, eq, lt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { after } from "next/server";

import {
    LiveAtcastAuthCreateSession,
    createDPoPFetch,
    getClientId,
    getRedirectUri,
} from "@atcast/atproto";
import { SESSION_TOKEN } from "@atcast/lib";
import { db, userAuthRequests, userSessions, users } from "@atcast/models";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { didResolver } from "@/lib/server/identity";

export const LiveAtcastAuthCreateSessionHandler: XRPCHandler<
    LiveAtcastAuthCreateSession.QueryParams,
    LiveAtcastAuthCreateSession.InputSchema,
    LiveAtcastAuthCreateSession.OutputSchema
> = {
    main: async (_, input) => {
        if (
            !input.iss ||
            !input.state ||
            !input.code ||
            input.iss !== "https://bsky.social"
        ) {
            return new AtprotoErrorResponse(
                {
                    error: "InvalidInput",
                },
                {
                    status: 400,
                },
            );
        }

        const authRequest = await db.query.userAuthRequests.findFirst({
            where: (userAuthRequest) => eq(userAuthRequest.state, input.state),
        });

        if (!authRequest) {
            return new AtprotoErrorResponse(
                {
                    error: "InvalidInput",
                },
                {
                    status: 400,
                },
            );
        }

        const bskyOauthSpec = await getBskyAuthInfo();

        const fetchInit: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: getClientId(),
                code: input.code,
                code_verifier: authRequest.pkceVerifier,
                grant_type: "authorization_code",
                redirect_uri: getRedirectUri(),
            }),
        };

        let tokenResponse: Response;
        if (authRequest.jwk) {
            const dpopFetch = createDPoPFetch({
                key: await JoseKey.fromJWK(authRequest.jwk as any),
                metadata: bskyOauthSpec,
            });

            tokenResponse = await dpopFetch(
                bskyOauthSpec.token_endpoint,
                fetchInit,
            );
        } else {
            tokenResponse = await fetch(
                bskyOauthSpec.token_endpoint,
                fetchInit,
            );
        }

        const tokenBody = await tokenResponse.json();

        if ("error" in tokenBody) {
            console.log(tokenBody);
            return new AtprotoErrorResponse(
                {
                    error: "InvalidInput",
                    message: tokenBody.error,
                },
                {
                    status: 400,
                },
            );
        }

        if (!tokenBody.sub) {
            return new AtprotoErrorResponse(
                { error: "InvalidUser" },
                {
                    status: 400,
                },
            );
        }

        if (tokenBody.sub !== authRequest.did) {
            return new AtprotoErrorResponse(
                { error: "InvalidUser" },
                {
                    status: 400,
                },
            );
        }

        const didDoc = await didResolver.resolve(tokenBody.sub);
        let handle: string | undefined;

        if (didDoc && didDoc.alsoKnownAs) {
            const url = new AtUri(didDoc.alsoKnownAs[0]);
            handle = url.host;
        }

        if (!handle) {
            return new AtprotoErrorResponse({ error: "InvalidUser" });
        }

        const sessionToken = nanoid(32);

        let user = await db.query.users.findFirst({
            where: (user) => eq(user.did, tokenBody.sub),
        });

        if (!user) {
            user = (
                await db
                    .insert(users)
                    .values({
                        handle,
                        did: tokenBody.sub,
                    })
                    .returning()
            )[0];
        }

        if (user.handle !== handle) {
            await db
                .update(users)
                .set({
                    handle,
                })
                .where(eq(users.id, user.id));
        }

        if (!user) {
            return new AtprotoErrorResponse({ error: "Failed to create user" });
        }

        const expiresAt = addDays(new Date(), 30);

        let accessTokenExpiresAt: Date | null = null;

        if (tokenBody.expires_in) {
            accessTokenExpiresAt = addSeconds(new Date(), tokenBody.expires_in);
        }

        await db.insert(userSessions).values({
            userId: user.id,
            token: sessionToken,
            accessToken: tokenBody.access_token,
            accessTokenExpiresAt,
            accessTokenType: tokenBody.token_type,
            refreshToken: tokenBody.refresh_token,
            expiresAt,
            jwk: authRequest.jwk,
        });

        await db
            .delete(userAuthRequests)
            .where(eq(userAuthRequests.id, authRequest.id));

        after(async () => {
            await db
                .delete(userSessions)
                .where(
                    and(
                        lt(userSessions.expiresAt, new Date()),
                        eq(userSessions.userId, user.id),
                    ),
                );

            await db
                .delete(userAuthRequests)
                .where(
                    and(
                        lt(userAuthRequests.expiresAt, new Date()),
                        eq(userAuthRequests.did, user.did),
                    ),
                );
        });

        const response = new JSONResponse({
            token: sessionToken,
        });

        response.cookies.set(SESSION_TOKEN, sessionToken, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            domain:
                process.env.NODE_ENV === "production"
                    ? "atcast.live"
                    : "localhost",
            sameSite: "strict",
            expires: expiresAt,
        });

        return response;
    },
};
