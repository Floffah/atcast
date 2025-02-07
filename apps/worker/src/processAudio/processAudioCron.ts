import { Cron } from "croner";

import { processAudioRequests } from "@/processAudio/processAudioRequests.ts";

export const processAudioCron = new Cron("*/5 * * * *", () =>
    processAudioRequests(),
);
