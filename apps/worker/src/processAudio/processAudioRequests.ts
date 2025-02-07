import { $ } from "bun";
import { and, eq, or } from "drizzle-orm";
import { exists, mkdir, open, readFile, rm } from "fs/promises";
import { resolve } from "path";

import {
    type AudioProcessRequest,
    audioProcessRequests,
    db,
    episodes,
} from "@atcast/models";

import { utAPI } from "@/lib/uploadthing.ts";

const DOWNLOAD_PATH = resolve(process.cwd(), "downloads");

if (!(await exists(DOWNLOAD_PATH))) {
    await mkdir(DOWNLOAD_PATH);
}

export async function processAudioRequests() {
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
                await saveError(req, e);
            }
        }),
    );
}

async function processAudioRequest(audioRequest: AudioProcessRequest) {
    await db
        .update(audioProcessRequests)
        .set({
            startedProcessingAt: new Date(),
        })
        .where(eq(audioProcessRequests.id, audioRequest.id));

    const fileUrl = `https://${process.env["UPLOADTHING_HOST"]}/f/${audioRequest.uploadthingFileKey}`;
    const response = await fetch(fileUrl);

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
        throw new Error("Missing content-disposition header");
    }

    const match = contentDisposition.match(/filename=\\?"(.+?)\\?"/);

    if (!match) {
        throw new Error("Failed to extract filename from content-disposition");
    }

    const uploadedFileName = match[1];

    if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const downloadedFilePath = resolve(
        DOWNLOAD_PATH,
        audioRequest.uploadthingFileKey + ".unoptimized",
    );
    const optimizedFilePath = downloadedFilePath.replace(
        ".unoptimized",
        ".opus",
    );

    // https://github.com/oven-sh/bun/issues/13237
    // await Bun.write(filePath, response, {
    //     createPath: true,
    // });

    const reader = response.body.getReader();
    const file = await open(downloadedFilePath, "w");

    for (let res = await reader.read(); !res.done; res = await reader.read()) {
        await file.write(res.value);
    }

    await file.close();

    try {
        await $`ffmpeg -i ${downloadedFilePath} -ar 48000 -b:a 32k -ac 2 -f opus ${optimizedFilePath}`;
    } catch (e: any) {
        await rm(optimizedFilePath);
        throw new Error(`Failed to optimize audio: ${e.message}`);
    } finally {
        await rm(downloadedFilePath);
    }

    const blob = new File(
        [await readFile(optimizedFilePath)],
        uploadedFileName,
        { type: "audio/ogg" },
    );

    const uploadResult = await utAPI.uploadFiles(blob);

    if (uploadResult.error) {
        await rm(optimizedFilePath);
        throw new Error(
            `Failed to upload optimized file: ${uploadResult.error.message}`,
        );
    }

    await utAPI.renameFiles({
        fileKey: uploadResult.data.key,
        newName: uploadedFileName,
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

async function saveError(audioRequest: AudioProcessRequest, error: Error) {
    await db
        .update(audioProcessRequests)
        .set({
            errorMessage: error.message,
        })
        .where(eq(audioProcessRequests.id, audioRequest.id));

    await utAPI.deleteFiles(audioRequest.uploadthingFileKey);
}
