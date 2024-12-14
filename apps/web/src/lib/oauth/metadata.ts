import clientMetadata from "~public/client-metadata.json";

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
