import {
    LiveAtcastShowEpisode,
    RecordNSIDs,
    createBskyClient,
    createDPoPFetch,
} from "@atcast/atproto";
import { retry } from "@atcast/lib";
import type { AudioProcessRequest, User, UserSession } from "@atcast/models";

import { bskyOauthMetadata } from "@/lib/bsky.ts";
import { didResolver } from "@/lib/identity.ts";

export async function pushAudioFileToRecord(
    audioRequest: AudioProcessRequest,
    user: User,
    userSession: UserSession,
    file: Buffer | Blob | File,
    fileName: string,
) {
    const atprotoAccount = await didResolver.resolveAtprotoData(user!.did);

    const pdsClient = createBskyClient({
        service: atprotoAccount.pds,
        fetch: createDPoPFetch({
            iss: bskyOauthMetadata.issuer,
            session: userSession,
            metadata: bskyOauthMetadata,
        }),
    });

    const existingRecordResponse = await pdsClient.com.atproto.repo.getRecord({
        repo: user.did,
        collection: RecordNSIDs.EPISODE,
        rkey: audioRequest.episodeId,
    });

    const existingRecord = existingRecordResponse.data
        .value as LiveAtcastShowEpisode.Record;

    const atprotoBlob = await retry(
        () =>
            pdsClient.com.atproto.repo.uploadBlob(file, {
                headers: {
                    "Content-Type": "audio/ogg",
                    "Content-Length": file.length.toString(),
                    "Content-Disposition": `attachment; filename="${fileName}.opus"`,
                },
            }),
        {
            retries: 2,
            allowError: (e) => e.message.includes("DPoP proof"),
        },
    );

    await pdsClient.com.atproto.repo.putRecord({
        repo: user.did,
        collection: RecordNSIDs.EPISODE,
        rkey: audioRequest.episodeId,
        record: {
            ...existingRecord,
            audio: atprotoBlob.data.blob,
        },
    });
}
