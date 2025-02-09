import { $ } from "bun";
import { rm } from "fs/promises";

export async function optimizeAudioFile(filePath: string) {
    const optimizedFilePath = filePath.replace(".unoptimized", ".opus");

    try {
        await $`ffmpeg -i ${filePath} -ar 48000 -b:a 32k -ac 2 -f opus ${optimizedFilePath}`;
    } catch (e: any) {
        await rm(optimizedFilePath);
        throw new Error(`Failed to optimize audio: ${e.message}`);
    } finally {
        await rm(filePath);
    }

    return {
        optimizedFilePath,
    };
}
