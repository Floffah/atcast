import { Hono } from "hono";
import { streamText } from "hono/streaming";

import { processAudioCron } from "@/processAudio/processAudioCron.ts";
import { processAudioRequests } from "@/processAudio/processAudioRequests.ts";

const app = new Hono();

const startedAt = new Date();

app.get("/", (c) =>
    c.json({
        onlineSince: startedAt.toISOString(),
        nextRunAt: processAudioCron.nextRun()?.toISOString(),
    }),
);

app.get("/health", (c) => c.json({ status: "ok" }));

if (process.env.NODE_ENV === "development") {
    app.get("/process-next", async (c) => {
        return streamText(c, async (stream) => {
            stream.writeln("ack");

            const interval = setInterval(() => {
                stream.writeln("keepalive");
            }, 1000);

            await processAudioRequests();

            clearInterval(interval);

            stream.writeln("5");
        });
    });
}

export default app;
