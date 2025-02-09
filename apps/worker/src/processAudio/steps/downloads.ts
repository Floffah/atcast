import { exists, mkdir, open } from "fs/promises";
import { resolve } from "path";

import type { AudioProcessRequest } from "@atcast/models";

export const DOWNLOAD_PATH = resolve(process.cwd(), "downloads");

if (!(await exists(DOWNLOAD_PATH))) {
    await mkdir(DOWNLOAD_PATH);
}

export async function downloadAudioRequestFile(
    audioRequest: AudioProcessRequest,
) {
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

    const originalFileName = match[1];

    if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const downloadedFilePath = resolve(
        DOWNLOAD_PATH,
        audioRequest.uploadthingFileKey + ".unoptimized",
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

    return {
        downloadedFilePath,
        originalFileName,
    };
}
