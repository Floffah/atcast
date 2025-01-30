import { JoseKey } from "@atproto/jwk-jose";
import { nanoid } from "nanoid";
import pkceChallenge from "pkce-challenge";

import { LiveAtcastAuthGetAuthUrl } from "@atcast/atproto";
import { db, userAuthRequests } from "@atcast/models";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import { getClientId, getRedirectUri } from "@/lib/oauth/metadata";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { createDPoPFetch } from "@/lib/server/dpopFetch";
import { handleResolver } from "@/lib/server/identity";
import clientMetadata from "~public/client-metadata.json";

export const LiveAtcastAuthGetAuthUrlHandler: XRPCHandler<
    LiveAtcastAuthGetAuthUrl.QueryParams,
    LiveAtcastAuthGetAuthUrl.InputSchema,
    LiveAtcastAuthGetAuthUrl.OutputSchema
> = {
    main: async (_, input) => {
        const handle = input.handle;

        const did = await handleResolver.resolve(handle);

        if (!did) {
            return new AtprotoErrorResponse(
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

        const dpopFetch = createDPoPFetch({
            key,
            metadata: bskyOauthSpec,
        });

        const parResponse = await dpopFetch(parEndpoint as string, {
            method: "POST",
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

        if (parResponse.error) {
            return new AtprotoErrorResponse({
                error: "FailedToCreateRequest",
                message: parResponse.error,
            });
        }

        const authUrl = new URL(authEndpoint);

        authUrl.searchParams.set("request_uri", parResponse.request_uri);
        authUrl.searchParams.set("client_id", client_id);

        return new JSONResponse({
            url: authUrl.toString(),
        });
    },
};
