import { JoseKey } from "@atproto/jwk-jose";
import { addDays } from "date-fns";
import { and, eq, lt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { after } from "next/server";

import { schemaDict } from "@atcast/atproto";
import { db, userAuthRequests, userSessions, users } from "@atcast/models";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { SESSION_TOKEN } from "@/lib/constants";
import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import { getClientId, getRedirectUri } from "@/lib/oauth/metadata";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { dpopFetch } from "@/lib/server/dpopFetch";
import { didResolver } from "@/lib/server/identity";

export const LiveAtcastAuthCreateSessionHandler: XRPCHandler<
    typeof schemaDict.LiveAtcastAuthCreateSession
> = {
    main: async (_, input) => {
        if (
            !input.iss ||
            !input.state ||
            !input.code ||
            input.iss !== "https://bsky.social"
        ) {
            return new JSONResponse(
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
            return new JSONResponse(
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
            tokenResponse = await dpopFetch(bskyOauthSpec.token_endpoint, {
                ...fetchInit,
                key: await JoseKey.fromJWK(authRequest.jwk as any),
                metadata: bskyOauthSpec,
            });
        } else {
            tokenResponse = await fetch(
                bskyOauthSpec.token_endpoint,
                fetchInit,
            );
        }

        const tokenBody = await tokenResponse.json();

        if ("error" in tokenBody) {
            console.log(tokenBody);
            return new JSONResponse(
                {
                    error: "InvalidInput",
                    error_description: tokenBody.error,
                },
                {
                    status: 400,
                },
            );
        }

        if (!tokenBody.sub) {
            return new JSONResponse(
                { error: "InvalidUser" },
                {
                    status: 500,
                },
            );
        }

        if (tokenBody.sub !== authRequest.did) {
            return new JSONResponse(
                { error: "InvalidUser" },
                {
                    status: 500,
                },
            );
        }

        const didDoc = await didResolver.resolve(tokenBody.sub);
        let name: string | undefined;

        if (didDoc && didDoc.alsoKnownAs) {
            const url = new URL(didDoc.alsoKnownAs[0]);
            name = url.host;
        }

        if (!name) {
            return new JSONResponse(
                { error: "InvalidUser" },
                {
                    status: 500,
                },
            );
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
                        name,
                        did: tokenBody.sub,
                    })
                    .returning()
            )[0];
        }

        if (user.name !== name) {
            await db
                .update(users)
                .set({
                    name,
                })
                .where(eq(users.id, user.id));
        }

        if (!user) {
            return new JSONResponse(
                { error: "Failed to create user" },
                {
                    status: 500,
                },
            );
        }

        const expiresAt = addDays(new Date(), 30);
        await db.insert(userSessions).values({
            userId: user.id,
            token: sessionToken,
            accessToken: tokenBody.access_token,
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
