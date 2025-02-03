import { OAuthAuthorizationServerMetadata } from "@atproto/oauth-client";

import { createBskyClient } from "@/lib/api/bskyClient";
import { getBskyAuthInfo } from "@/lib/oauth/bsky";
import {
    CreateDPopFetchOptions,
    createDPoPFetch,
} from "@/lib/server/dpopFetch";
import { didResolver } from "@/lib/server/identity";

export async function createPDSClient(
    options: Omit<CreateDPopFetchOptions, "metadata"> & {
        did: string;
        metadata?: OAuthAuthorizationServerMetadata;
    },
) {
    const atprotoData = await didResolver.resolveAtprotoData(options.did);

    const metadata = options.metadata ?? (await getBskyAuthInfo());

    return createBskyClient({
        service: atprotoData.pds,
        fetch: createDPoPFetch({
            ...options,
            metadata,
        }),
    });
}
