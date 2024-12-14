import clientMetadata from "~public/client-metadata.json";

export function getRedirectUri() {
    return process.env.NODE_ENV === "production"
        ? clientMetadata.redirect_uris[0]
        : "http://127.0.0.1:3000/";
}

export function getClientId() {
    return process.env.NODE_ENV === "production"
        ? clientMetadata.client_id
        : "http://localhost";
}
