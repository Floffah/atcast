import { JoseKey } from "@atproto/jwk-jose";
import { eq } from "drizzle-orm";

import { UserSession, db, userSessions } from "@atcast/models";

import { createDPoPFetch, fetchOASForIssuer } from "@/api";
import { getClientId } from "@/client/clientMetadata";

export async function ensureSessionValid(
    userSession: UserSession,
    opts: {
        metadata: Awaited<ReturnType<typeof fetchOASForIssuer>>;
    },
) {
    if (
        userSession.accessTokenExpiresAt &&
        userSession.accessTokenExpiresAt < new Date()
    ) {
        const key = await JoseKey.fromJWK(userSession.jwk as any);

        const dpopFetch = createDPoPFetch({
            key,
            metadata: opts.metadata,
        });

        const refreshData = await dpopFetch(opts.metadata.token_endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: getClientId(),
                grant_type: "refresh_token",
                refresh_token: userSession.refreshToken,
            }),
        }).then((res) => res.json());

        if (refreshData.error) {
            throw new Error(
                "Failed to refresh token: " + refreshData.error.message,
            );
        }

        const insertResult = await db
            .update(userSessions)
            .set({
                accessToken: refreshData.access_token,
                accessTokenExpiresAt: new Date(
                    Date.now() + refreshData.expires_in * 1000,
                ),
                refreshToken: refreshData.refresh_token,
                accessTokenType: refreshData.token_type,
            })
            .where(eq(userSessions.id, userSession.id))
            .returning();

        if (!insertResult) {
            throw new Error("Failed to update session after refresh");
        }

        return insertResult[0];
    }

    return userSession;
}
