import { AtUri } from "@atproto/api";

import { Episode, User, db } from "@atcast/models";

import { EpisodeProcessingBanner } from "@/app/(core)/[repo]/[id]/AudioPlayerSection/EpisodeProcessingBanner";

export async function AudioPlayerSection({
    uri,
    user,
    internalEpisode: _,
}: {
    uri: AtUri;
    user: User;
    internalEpisode: Episode;
}) {
    const processRequests = await db.query.audioProcessRequests.findMany({
        where: (audioProcessRequests, { and, eq }) =>
            and(
                eq(audioProcessRequests.episodeId, uri.rkey),
                eq(audioProcessRequests.userId, user.id),
            ),
    });

    if (processRequests.length > 0) {
        return <EpisodeProcessingBanner />;
    }

    return null;
}
