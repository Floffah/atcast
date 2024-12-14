import { atprotoSchemaDict } from "@atcast/atproto";
import { db, userSessions } from "@atcast/models";
import { userAuthRequests } from "@atcast/models";
import { DidResolver, HandleResolver } from "@atproto/identity";
import { JoseKey } from "@atproto/jwk-jose";
import { nanoid } from "nanoid";
import pkceChallenge from "pkce-challenge";
import clientMetadata from "~public/client-metadata.json";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { JSONResponse } from "@/lib/JSONResponse";
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
};
