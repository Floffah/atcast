"use server";

import { db, userAuthRequests, userSessions, users } from "@atcast/models";
import { JoseKey } from "@atproto/jwk-jose";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { CloseTab } from "@/app/login/oauth/CloseTab";
import { JSONResponse } from "@/lib/JSONResponse";
import { DPoPRequestInit, dpopFetch } from "@/lib/dpopFetch";
import { didResolver } from "@/lib/identity";
import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import { getClientId, getRedirectUri } from "@/lib/oauth/metadata";

export default async function LoginPage({ searchParams }) {
    const params = await searchParams;

    if (
        !params.iss ||
        !params.state ||
        !params.code ||
        params.iss !== "https://bsky.social"
    ) {
        return notFound();
    }

    if (
        process.env.NEXT_PUBLIC_BASE_URL?.includes("localhost") &&
        params.redir !== "1"
    ) {
        return redirect(
            `http://localhost:3000/?${new URLSearchParams(params).toString()}&redir=1`,
        );
    }

    const authRequest = await db.query.userAuthRequests.findFirst({
        where: (userAuthRequest) => eq(userAuthRequest.state, params.state),
    });

    if (!authRequest) {
        return notFound();
    }

    const bskyOauthSpec = await getBskyAuthInfo();

    const fetchInit: RequestInit | DPoPRequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: getClientId(),
            code: params.code,
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
        tokenResponse = await fetch(bskyOauthSpec.token_endpoint, fetchInit);
    }

    if (!tokenResponse.ok) {
        return new Response("Failed to get token", {
            status: 500,
        });
    }

    const tokenBody = await tokenResponse.json();

    if ("error" in tokenBody) {
        return new JSONResponse(
            { error: "Failed to get token: " + tokenBody.error },
            {
                status: 500,
            },
        );
    }

    if (!tokenBody.sub) {
        return new JSONResponse(
            { error: "No subject in token" },
            {
                status: 500,
            },
        );
    }

    if (tokenBody.sub !== authRequest.did) {
        return new JSONResponse(
            { error: "Invalid token subject" },
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
            {
                error: "Failed to get name from DID",
            },
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

    return (
        <CloseTab sessionToken={sessionToken} expires={expiresAt.getTime()} />
    );
}
