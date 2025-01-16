import type { OAuthAuthorizationServerMetadata } from "@atproto/oauth-client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

export async function getBskyAuthInfo() {
    "use cache";
    cacheLife("wellKnown");

    return fetch(
        "https://bsky.social/.well-known/oauth-authorization-server",
    ).then((res) => res.json() as Promise<OAuthAuthorizationServerMetadata>);
}
