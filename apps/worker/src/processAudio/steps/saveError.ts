import { eq } from "drizzle-orm";

import {
    type AudioProcessRequest,
    audioProcessRequests,
    db,
} from "@atcast/models";

import { utAPI } from "@/lib/uploadthing.ts";

export async function saveError(
    audioRequest: AudioProcessRequest,
    error: Error,
) {
    await db
        .update(audioProcessRequests)
        .set({
            errorMessage: error.message,
        })
        .where(eq(audioProcessRequests.id, audioRequest.id));

    await utAPI.deleteFiles(audioRequest.uploadthingFileKey);
}
