import { JoseKey } from "@atproto/jwk-jose";
import { $ } from "bun";
import { and, eq, or } from "drizzle-orm";
import { exists, mkdir, open, readFile, readdir, rm } from "fs/promises";
import { resolve } from "path";

import {
    LiveAtcastShowEpisode,
    RecordNSIDs,
    createBskyClient,
    createDPoPFetch,
    getClientId,
} from "@atcast/atproto";
import { retry } from "@atcast/lib";
import {
    type AudioProcessRequest,
    audioProcessRequests,
    db,
    episodes,
    userSessions,
} from "@atcast/models";

import { bskyOauthMetadata } from "@/lib/bsky.ts";
import { didResolver } from "@/lib/identity.ts";
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

async function processAudioRequest(audioRequest: AudioProcessRequest) {
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

    const optimizedFileData = await readFile(optimizedFilePath);

    const uploadthingFile = new File([optimizedFileData], uploadedFileName, {
        type: "audio/ogg",
    });

    const uploadResult = await utAPI.uploadFiles(uploadthingFile);

    if (uploadResult.error) {
        await rm(optimizedFilePath);
        throw new Error(
            `Failed to upload optimized file: ${uploadResult.error.message}`,
        );
    }

    if (
        userSession.accessTokenExpiresAt &&
        userSession.accessTokenExpiresAt < new Date()
    ) {
        const key = await JoseKey.fromJWK(userSession.jwk as any);

        const dpopFetch = createDPoPFetch({
            key,
            metadata: bskyOauthMetadata,
        });

        const refreshData = await dpopFetch(bskyOauthMetadata.token_endpoint, {
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

        userSession = insertResult[0];
    }

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
            pdsClient.com.atproto.repo.uploadBlob(uploadthingFile, {
                headers: {
                    "Content-Type": "audio/ogg",
                    "Content-Length": optimizedFileData.length.toString(),
                    "Content-Disposition": `attachment; filename="${uploadedFileName}.opus"`,
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
