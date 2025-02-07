import { AtUri } from "@atproto/api";
import { ATP_URI_REGEX } from "@atproto/syntax";
import { type FileRouter, UTFiles, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

import { audioProcessRequests, db } from "@atcast/models";

import { getEpisode } from "@/lib/server/data/getEpisode";
import { getSessionFromRequest } from "@/lib/server/data/getSession";

const uploadthing = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const utFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    audioUploader: uploadthing({
        audio: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "32MB",
            maxFileCount: 1,
        },
    })
        .input(
            z.object({
                episodeUri: z.string().regex(ATP_URI_REGEX, "Invalid ATP URI"),
            }),
        )
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req, input, files }) => {
            // This code runs on your server before upload
            const { user } = await getSessionFromRequest(req);

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized");

            const uri = new AtUri(input.episodeUri);

            if (uri.host !== user.did)
                throw new UploadThingError(
                    "User does not have access to this episode",
                );

            // Check if the user has access to the episode
            const episode = await getEpisode(uri);

            if (!episode) throw new UploadThingError("Episode not found");

            const existingProcessRequests =
                await db.query.audioProcessRequests.findMany({
                    where: (audioProcessRequests, { and, eq }) =>
                        and(
                            eq(audioProcessRequests.episodeId, uri.rkey),
                            eq(audioProcessRequests.userId, user.id),
                        ),
                });

            if (existingProcessRequests.length > 0) {
                throw new UploadThingError("Audio already uploaded");
            }

            const fileOverrides = files.map((file) => ({
                ...file,
                name: `${uri.host}.${uri.rkey}.${file.name}`,
                customId: encodeURIComponent(uri.toString()),
            }));

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return {
                userId: user.id,
                userDID: user.did,
                atUri: uri.toString(),

                [UTFiles]: fileOverrides,
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const atUri = new AtUri(metadata.atUri);

            const insertResults = await db
                .insert(audioProcessRequests)
                .values({
                    episodeId: atUri.rkey,
                    userId: metadata.userId,
                    uploadthingFileKey: file.key,
                })
                .returning();

            const processRequest = insertResults[0];

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return {
                uploadedBy: metadata.userId,
                processRequestId: processRequest.id,
            };
        }),
} satisfies FileRouter;

export type UTFileRouter = typeof utFileRouter;
