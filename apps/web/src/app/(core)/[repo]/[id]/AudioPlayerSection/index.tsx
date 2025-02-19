import { AtUri } from "@atproto/api";

import { Episode, User, db } from "@atcast/models";

import { EpisodeProcessingBanner } from "@/app/(core)/[repo]/[id]/AudioPlayerSection/EpisodeProcessingBanner";
import { NoAudioBanner } from "@/app/(core)/[repo]/[id]/AudioPlayerSection/NoAudioBanner";
import { ProcessingErrorBanner } from "@/app/(core)/[repo]/[id]/AudioPlayerSection/ProcessingErrorBanner";

export async function AudioPlayerSection({
    uri,
    user,
    internalEpisode,
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
        const erroredRequest = processRequests.find(
            (req) => !!req.errorMessage,
        );

        if (erroredRequest) {
            return (
                <ProcessingErrorBanner internalEpisode={internalEpisode}>
                    {erroredRequest.errorMessage}
                </ProcessingErrorBanner>
            );
        }

        return <EpisodeProcessingBanner />;
    }

    if (!internalEpisode.uploadthingFileKey) {
        return <NoAudioBanner internalEpisode={internalEpisode} />;
    }

    return (
        <audio controls>
            <source
                src={`https://${process.env.UPLOADTHING_HOST}/f/${internalEpisode.uploadthingFileKey}`}
                type="audio/ogg"
            />
        </audio>
    );
}
