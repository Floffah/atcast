import { and, eq, or } from "drizzle-orm";
import { readFile, rm } from "fs/promises";

import { ensureSessionValid } from "@atcast/atproto";
import {
    type AudioProcessRequest,
    audioProcessRequests,
    db,
    episodes,
} from "@atcast/models";

import { bskyOauthMetadata } from "@/lib/bsky.ts";
import { utAPI } from "@/lib/uploadthing.ts";
import { downloadAudioRequestFile } from "@/processAudio/steps/downloads.ts";
import { optimizeAudioFile } from "@/processAudio/steps/optimizeAudioFile.ts";
import { pushAudioFileToRecord } from "@/processAudio/steps/pushAudioFileToRecord.ts";

export async function processAudioRequest(audioRequest: AudioProcessRequest) {
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, audioRequest.userId),
    });

    if (!user) {
        throw new Error("User not found");
    }

    let userSession = await db.query.userSessions.findFirst({
        where: (userSessions, { eq }) =>
            eq(userSessions.userId, audioRequest.userId),
        orderBy: (userSessions, { desc }) => desc(userSessions.expiresAt),
    });

    if (!userSession) {
        throw new Error(
            "No user session available to update PDS record - please log in again and retry",
        );
    }

    userSession = await ensureSessionValid(userSession, {
        metadata: bskyOauthMetadata,
    });

    await db
        .update(audioProcessRequests)
        .set({
            startedProcessingAt: new Date(),
        })
        .where(eq(audioProcessRequests.id, audioRequest.id));

    const { downloadedFilePath, originalFileName } =
        await downloadAudioRequestFile(audioRequest);

    const { optimizedFilePath } = await optimizeAudioFile(downloadedFilePath);

    const optimizedFileData = await readFile(optimizedFilePath);

    const blob = new File([optimizedFileData], originalFileName, {
        type: "audio/ogg",
    });

    await pushAudioFileToRecord(
        audioRequest,
        user,
        userSession,
        blob,
        originalFileName,
    );

    const uploadResult = await utAPI.uploadFiles(blob);

    if (uploadResult.error) {
        await rm(optimizedFilePath);
        throw new Error(`Failed to upload file: ${uploadResult.error.message}`);
    }

    await utAPI.renameFiles({
        fileKey: uploadResult.data.key,
        newName: originalFileName,
    });

    await utAPI.deleteFiles(audioRequest.uploadthingFileKey);

    await db
        .update(episodes)
        .set({
            uploadthingFileKey: uploadResult.data.key,
        })
        .where(
            and(
                eq(episodes.userId, audioRequest.userId),
                eq(episodes.id, audioRequest.episodeId),
            ),
        );

    await db
        .delete(audioProcessRequests)
        .where(
            or(
                eq(audioProcessRequests.id, audioRequest.id),
                and(
                    eq(audioProcessRequests.userId, audioRequest.userId),
                    eq(audioProcessRequests.episodeId, audioRequest.episodeId),
                ),
            ),
        );

    await rm(optimizedFilePath);
}
