import { AtUri } from "@atproto/api";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

import {
    ComAtprotoRepoGetRecord,
    LiveAtcastShowEpisode,
    RecordNSIDs,
    createBskyClient,
} from "@atcast/atproto";
import { db, episodes, users } from "@atcast/models";

import { didResolver } from "@/lib/server/identity";

export const getEpisode = cache(async (uri: AtUri) => {
    const accountData = await didResolver.resolveAtprotoData(uri.host);

    if (!accountData) {
        return null;
    }
    let user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.did, uri.host),
    });

    if (!user) {
        const insertResult = await db
            .insert(users)
            .values({
                did: uri.host,
                handle: accountData.handle,
                lastActiveAt: null,
            })
            .returning();

        user = insertResult[0];
    }

    let episode = await db.query.episodes.findFirst({
        where: (episodes, { eq, and }) =>
            and(eq(episodes.userId, user.id), eq(episodes.id, uri.rkey)),
    });

    const bskyClient = createBskyClient({
        service: accountData.pds,
    });

    let record: ComAtprotoRepoGetRecord.Response | null = null;

    try {
        record = await bskyClient.com.atproto.repo.getRecord({
            repo: uri.host,
            collection: RecordNSIDs.EPISODE,
            rkey: uri.rkey,
        });
    } catch (_e) {}

    if (!record || !record.data) {
        if (episode) {
            await db
                .delete(episodes)
                .where(
                    and(
                        eq(episodes.userId, user.id),
                        eq(episodes.id, uri.rkey),
                    ),
                );
        }

        return null;
    }

    const recordData = record.data as ComAtprotoRepoGetRecord.OutputSchema & {
        value: LiveAtcastShowEpisode.Record;
    };

    if (!episode) {
        const insertResult = await db
            .insert(episodes)
            .values({
                id: uri.rkey,
                userId: user.id,
                publishedAt: recordData.value.publishedAt
                    ? new Date(recordData.value.publishedAt)
                    : new Date(),
            })
            .returning();

        episode = insertResult[0];
    }

    return {
        recordData,
        user,
        episode,
    };
});
