import { LiveAtcastPodcastShow } from "@atcast/atproto";
import { db, showCollaborators, shows } from "@atcast/models";

import { RecordHandler } from "@/app/xrpc/[nsid]/routes/recordHandlers/index";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";

export const LiveAtcastPodcastShowRecordHandler: RecordHandler = {
    create: async (_, input, _1, session) => {
        const previouslyCreatedShows =
            await db.query.showCollaborators.findMany({
                where: (showCollaborators, { eq, and }) =>
                    and(
                        eq(showCollaborators.userId, session.userId),
                        eq(showCollaborators.type, "OWNER"),
                    ),
            });

        if (previouslyCreatedShows.length > 0) {
            return {
                errorResponse: new AtprotoErrorResponse({
                    error: "RecordAlreadyExists",
                    message: "Users are currently limited to one show",
                }),
                newInput: undefined,
            };
        }

        const inputRecord = input.record as LiveAtcastPodcastShow.Record;

        const insertResult = await db
            .insert(shows)
            .values({
                name: inputRecord.name,
                description: inputRecord.description,
            })
            .returning();
        const show = insertResult[0];

        await db.insert(showCollaborators).values({
            showId: show.id,
            userId: session.userId,
            type: "OWNER",
        });

        return {
            errorResponse: undefined,
            newInput: {
                ...input,
                rkey: show.publicId,
            },
        };
    },
};
