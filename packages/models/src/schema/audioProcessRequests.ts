import { boolean, foreignKey, pgTable, serial } from "drizzle-orm/pg-core";

import { episodes } from "@/schema/episodes";
import { publicId, publicIdLike, uploadthingFileKey } from "@/schema/fields";

export const audioProcessRequests = pgTable(
    "audio_process_requests",
    {
        id: publicId("id").primaryKey(),

        userId: serial("user_id").notNull(),
        episodeId: publicIdLike("episode_id").notNull(),

        uploadthingFileKey: uploadthingFileKey("ut_file_key"),

        processing: boolean("processing").notNull().default(false),
    },
    (audioUploads) => [
        foreignKey({
            columns: [audioUploads.userId, audioUploads.episodeId],
            foreignColumns: [episodes.userId, episodes.id],
        }).onDelete("cascade"),
    ],
);
