import { sha256 as atprotoSHA256 } from "@atproto/crypto";
import { JoseKey } from "@atproto/jwk-jose";
import { OAuthAuthorizationServerMetadata } from "@atproto/oauth-client";
import { LRUCache } from "lru-cache";
import { base64url } from "multiformats/bases/base64";

import { UserSession } from "@atcast/models";

export const dPoPNonceMap = new LRUCache<string, string>({
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
    ttl: 60e3,
    max: 100,
});

export interface CreateDPopFetchOptions {
    key?: JoseKey;
    metadata: OAuthAuthorizationServerMetadata;
    iss?: string;
    session?: UserSession;
}

export function createDPoPFetch(options: CreateDPopFetchOptions): typeof fetch {
    if (!options.key && !options.session) {
        throw new Error("Either key or session must be provided");
    }

    return async function fetchWithDPoP(
        input: RequestInfo | URL,
        init?: RequestInit,
    ) {
        const request =
            input instanceof Request ? input : new Request(input, init);

        const key =
            options.key ?? (await JoseKey.fromJWK(options.session!.jwk as any));

        let alg = key.algorithms[0];

        if (options.metadata.dpop_signing_alg_values_supported) {
            const possibleAlg =
                options.metadata.dpop_signing_alg_values_supported.find((alg) =>
                    key.algorithms.includes(alg),
                );
            if (possibleAlg) {
                alg = possibleAlg;
            }
        }

        let ath: string | undefined = undefined;

        if (options.session) {
            ath = await sha256(options.session.accessToken);

            request.headers.set(
                "Authorization",
                `DPoP ${options.session.accessToken}`,
            );
        }

        const url = new URL(request.url);

        const initialNonce = dPoPNonceMap.get(url.origin);

        const jwt = await createJWK(
            alg,
            key,
            options,
            request,
            initialNonce,
            ath,
        );

        request.headers.set("DPoP", jwt);

        const initialResponse = await fetch(request);

        const nonce = initialResponse.headers.get("dpop-nonce");
        if (!nonce || nonce === initialNonce) {
            return initialResponse;
        }

        try {
            dPoPNonceMap.set(url.origin, nonce);
        } catch {}

        const peekedResponse = await initialResponse.clone().json();

        if (peekedResponse.error !== "use_dpop_nonce") {
            return initialResponse;
        }

        // Cannot retry consumed requests, its up to the user to handle this
        if (input === request) {
            return initialResponse;
        }

        if (ReadableStream && init?.body instanceof ReadableStream) {
            return initialResponse;
        }

        await initialResponse.body?.cancel();

        const retryJwt = await createJWK(
            alg,
            key,
            options,
            request,
            nonce,
            ath,
        );

        const retryRequest = new Request(request, init);
        retryRequest.headers.set("DPoP", retryJwt);

        return await fetch(retryRequest);
    };
}

async function createJWK(
    alg: string,
    key: JoseKey,
    dPoPOptions: CreateDPopFetchOptions,
    request: Request,
    nonce?: string,
    ath?: string,
) {
    return await key.createJwt(
        {
            alg,
            typ: "dpop+jwt",
            jwk: key.bareJwk,
        },
        {
            iss: dPoPOptions.iss ?? dPoPOptions.metadata.issuer,
            iat: Math.floor(Date.now() / 1e3),
            jti: Math.random().toString(36).slice(2),
            htm: request.method,
            htu: request.url,
            nonce,
            ath: ath?.toString(),
        },
    );
}

async function sha256(input: string): Promise<string> {
    let bytes: Uint8Array<ArrayBufferLike>;

    if (globalThis.crypto?.subtle) {
        const inputBytes = new TextEncoder().encode(input);
        const digest = await globalThis.crypto.subtle.digest(
            "SHA-256",
            inputBytes,
        );
        bytes = new Uint8Array(digest);
    } else {
        bytes = await atprotoSHA256(input);
    }

    return base64url.baseEncode(bytes);
}
