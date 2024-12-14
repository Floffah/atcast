import { OAuthAuthorizationServerMetadata } from "@atproto/oauth-client";
import { unstable_cache } from "next/cache";

export const getBskyAuthInfo = unstable_cache(
    () =>
        fetch(
            "https://bsky.social/.well-known/oauth-authorization-server",
        ).then(
            (res) => res.json() as Promise<OAuthAuthorizationServerMetadata>,
        ),
    ["bskyAuthInfo"],
);
