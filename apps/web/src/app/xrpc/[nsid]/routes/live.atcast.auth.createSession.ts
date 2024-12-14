import { atprotoSchemaDict } from "@atcast/atproto";
import { db, userSessions } from "@atcast/models";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import pkceChallenge from "pkce-challenge";
import clientMetadata from "~public/client-metadata.json";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";

export const LiveAtcastAuthCreateSessionHandler: XRPCHandler<
    typeof atprotoSchemaDict.LiveAtcastAuthCreateSession
> = {
    start: async (_, input) => {
        const bskyOauthSpec = await fetch(
            "https://bsky.social/.well-known/oauth-authorization-server",
        ).then((res) => res.json());

        const parEndpoint = bskyOauthSpec.pushed_authorization_request_endpoint;

        const handle = input.handle;

        const token = nanoid(32);
        const pkce = await pkceChallenge();

        db.insert(userSessions).values({
            handle,
            token,
            pkceVerifier: pkce.code_verifier,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        });

        const parResponse = await fetch(parEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientMetadata.client_id,
                response_type: clientMetadata.response_types[0],
                redirect_uri:
                    process.env.NODE_ENV === "production"
                        ? clientMetadata.redirect_uris[0]
                        : "http://localhost:3000/login/oauth",
                state: token,
                scopes: clientMetadata.scope,
                login_hint: handle,
                pkce: pkce.code_challenge,
            }),
        }).then((res) => res.json());

        console.log(parResponse);

        return new NextResponse(
            JSON.stringify({
                error: "InvalidHandle",
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    },
};
