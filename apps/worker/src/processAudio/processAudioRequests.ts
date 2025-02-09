import { readdir, rm } from "fs/promises";
import { resolve } from "path";

import { db } from "@atcast/models";

import { processAudioRequest } from "@/processAudio/processAudioRequest.ts";
import { DOWNLOAD_PATH } from "@/processAudio/steps/downloads.ts";
import { saveError } from "@/processAudio/steps/saveError.ts";

let currentPromise: Promise<void> | null = null;

export async function processAudioRequests() {
    if (currentPromise) {
        await currentPromise;
    } else {
        currentPromise = processAudioRequestsInner();

        await currentPromise;

        currentPromise = null;
    }
}

export async function processAudioRequestsInner() {
    const audioRequests = await db.query.audioProcessRequests.findMany({
        where: (audioProcessRequests, { isNull, isNotNull, and }) =>
            and(
                isNull(audioProcessRequests.startedProcessingAt),
                isNull(audioProcessRequests.errorMessage),
                isNotNull(audioProcessRequests.uploadthingFileKey),
            ),
        orderBy: (audioProcessRequests, { asc }) =>
            asc(audioProcessRequests.createdAt),
        limit: 5,
    });

    await Promise.allSettled(
        audioRequests.map(async (req) => {
            try {
                await processAudioRequest(req);
            } catch (e: any) {
                console.log(e);
                await saveError(req, e);
            }
        }),
    );

    const files = await readdir(DOWNLOAD_PATH);
    await Promise.allSettled(
        files.map((file) => rm(resolve(DOWNLOAD_PATH, file))),
    );
}
