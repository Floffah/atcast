import { atprotoSchemaDict } from "@atcast/atproto";
import { db, userAuthRequests, userSessions, users } from "@atcast/models";
import { JoseKey } from "@atproto/jwk-jose";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import pkceChallenge from "pkce-challenge";
import clientMetadata from "~public/client-metadata.json";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { JSONResponse } from "@/lib/JSONResponse";
import { SESSION_TOKEN } from "@/lib/constants";
import { dpopFetch } from "@/lib/dpopFetch";
import { didResolver, handleResolver } from "@/lib/identity";
import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import { getClientId, getRedirectUri } from "@/lib/oauth/metadata";

export const LiveAtcastAuthCreateSessionHandler: XRPCHandler<
    typeof atprotoSchemaDict.LiveAtcastAuthCreateSession
> = {
    start: async (_, input) => {
        const handle = input.handle;

        const did = await handleResolver.resolve(handle);

        if (!did) {
            return new JSONResponse(
                {
                    error: "InvalidHandle",
                },
                {
                    status: 400,
                },
            );
        }

        const didDoc = await didResolver.resolve(did);

        if (!didDoc) {
            return new JSONResponse(
                {
                    error: "InvalidHandle",
                },
                {
                    status: 400,
                },
            );
        }

        const bskyOauthSpec = await getBskyAuthInfo();

        const authEndpoint = bskyOauthSpec.authorization_endpoint;
        const parEndpoint = bskyOauthSpec.pushed_authorization_request_endpoint;

        const key = await JoseKey.generate(
            bskyOauthSpec.dpop_signing_alg_values_supported,
        );

        const state = nanoid(32);
        const pkce = await pkceChallenge();

        await db.insert(userAuthRequests).values({
            did,
            state,
            pkceVerifier: pkce.code_verifier,
            jwk: key.privateJwk,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        });

        const client_id = getClientId();

        const parResponse = await dpopFetch(parEndpoint, {
            method: "POST",
            key,
            metadata: bskyOauthSpec,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id,
                response_type: "code",
                redirect_uri: getRedirectUri(),
                state,
                scope: clientMetadata.scope,
                login_hint: handle,
                code_challenge: pkce.code_challenge,
                code_challenge_method: "S256",
            }),
        }).then((res) => res.json());

        if (!parResponse.request_uri) {
            return new JSONResponse(
                {
                    error: "FailedToCreateRequest",
                    error_description: parResponse.error,
                },
                {
                    status: 500,
                },
            );
        }

        const authUrl = new URL(authEndpoint);

        authUrl.searchParams.set("request_uri", parResponse.request_uri);
        authUrl.searchParams.set("client_id", client_id);

        return new JSONResponse({
            url: authUrl.toString(),
        });
    },
    finish: async (_, input) => {
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
