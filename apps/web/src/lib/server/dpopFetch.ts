import { JoseKey } from "@atproto/jwk-jose";
import { OAuthAuthorizationServerMetadata } from "@atproto/oauth-client";
import { LRUCache } from "lru-cache";

const nonceMap = new LRUCache<string, string>({
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
    ttl: 60e3,
    max: 100,
});

export interface DPoPRequestInit extends RequestInit {
    key: JoseKey;
    metadata: OAuthAuthorizationServerMetadata;
    iss?: string;
}

export async function dpopFetch(
    input: RequestInfo | URL,
    init: DPoPRequestInit,
) {
    const request = input instanceof Request ? input : new Request(input, init);

    let alg = init.key.algorithms[0];

    if (init.metadata.dpop_signing_alg_values_supported) {
        const possibleAlg =
            init.metadata.dpop_signing_alg_values_supported.find((alg) =>
                init.key.algorithms.includes(alg),
            );
        if (possibleAlg) {
            alg = possibleAlg;
        }
    }

    const url = new URL(request.url);

    const initialNonce = nonceMap.get(url.origin);

    const jwt = await init.key.createJwt(
        {
            alg,
            typ: "dpop+jwt",
            jwk: init.key.bareJwk,
        },
        {
            iss: init.iss ?? init.metadata.issuer,
            iat: Math.floor(Date.now() / 1e3),
            jti: Math.random().toString(36).slice(2), // https://github.com/bluesky-social/atproto/blob/main/packages/oauth/oauth-client/src/fetch-dpop.ts#L170-L171
            htm: init.method,
            htu: request.url,
            nonce: initialNonce,
        },
    );

    request.headers.set("DPoP", jwt);

    const initialResponse = await fetch(request);

    const nonce = initialResponse.headers.get("DPoP-Nonce");
    if (!nonce || nonce === initialNonce) {
        return initialResponse;
    }

    try {
        nonceMap.set(url.origin, nonce);
    } catch (_e) {}

    const peekedResponse = await initialResponse.clone().json();

    if (peekedResponse.error !== "use_dpop_nonce") {
        return initialResponse;
    }

    if (input === request) {
        return initialResponse;
    }

    if (ReadableStream && init?.body instanceof ReadableStream) {
        return initialResponse;
    }

    await initialResponse.body?.cancel();

    const retryJwt = await init.key.createJwt(
        {
            alg,
            typ: "dpop+jwt",
            jwk: init.key.bareJwk,
        },
        {
            iss: init.iss ?? init.metadata.issuer,
            iat: Math.floor(Date.now() / 1e3),
            jti: Math.random().toString(36).slice(2),
            htm: init.method,
            htu: request.url,
            nonce,
        },
    );

    const retryRequest = new Request(request, init);
    retryRequest.headers.set("DPoP", retryJwt);

    return await fetch(retryRequest);
}
