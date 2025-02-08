import type { OAuthAuthorizationServerMetadata } from "@atproto/oauth-client";

export const fetchOASForIssuer = async (issuer: string) =>
    fetch(`${issuer}/.well-known/oauth-authorization-server`).then(
        (res) => res.json() as Promise<OAuthAuthorizationServerMetadata>,
    );

export const fetchBskyOAS = async () =>
    fetchOASForIssuer("https://bsky.social");
