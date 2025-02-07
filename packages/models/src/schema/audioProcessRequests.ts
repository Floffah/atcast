import {
    foreignKey,
    pgTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { episodes } from "@/schema/episodes";
import {
    createdAt,
    publicId,
    publicIdLike,
    uploadthingFileKey,
} from "@/schema/fields";

export const audioProcessRequests = pgTable(
    "audio_process_requests",
    {
        id: publicId("id").primaryKey(),

        userId: serial("user_id").notNull(),
        episodeId: publicIdLike("episode_id").notNull(),

        uploadthingFileKey: uploadthingFileKey("ut_file_key").notNull(),

        startedProcessingAt: timestamp("started_processing_at"),
        errorMessage: text(),

        createdAt: createdAt(),
    },
    (audioUploads) => [
        foreignKey({
            columns: [audioUploads.userId, audioUploads.episodeId],
            foreignColumns: [episodes.userId, episodes.id],
        }).onDelete("cascade"),
    ],
);

export type AudioProcessRequest = typeof audioProcessRequests.$inferSelect;
