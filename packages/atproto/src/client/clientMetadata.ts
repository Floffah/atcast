export const clientMetadata = {
    client_id: "https://atcast.live/client-metadata.json",
    client_uri: "https://atcast.live/",
    client_name: "AtCast",
    application_type: "web",
    grant_types: ["authorization_code", "refresh_token"],
    scope: "atproto transition:generic transition:chat.bsky",
    response_types: ["code"],
    redirect_uris: ["https://atcast.live/oauth"],
    dpop_bound_access_tokens: true,
    token_endpoint_auth_method: "none",
};

export function getRedirectUri() {
    return process.env.NODE_ENV === "production"
        ? clientMetadata.redirect_uris[0]
        : "http://127.0.0.1:3000/";
}

export function getClientId() {
    if (process.env.NODE_ENV === "production") {
        return clientMetadata.client_id;
    }

    // see virtual metadata under "Localhost Client Development" in https://atproto.com/specs/oauth#clients
    const params = new URLSearchParams({
        redirect_uri: getRedirectUri(),
        scope: clientMetadata.scope,
    });

    return "http://localhost?" + params.toString();
}
