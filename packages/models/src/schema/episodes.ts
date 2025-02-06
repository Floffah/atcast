import { pgTable, primaryKey, serial } from "drizzle-orm/pg-core";

import { createdAt, publicId, uploadthingFileKey } from "@/schema/fields";
import { users } from "@/schema/users";

export const episodes = pgTable(
    "episodes",
    {
        id: publicId("id"),
        userId: serial("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),

        uploadthingFileKey: uploadthingFileKey("ut_file_key"),

        publishedAt: createdAt("published_at"),
    },
    (episodes) => [
        primaryKey({
            columns: [episodes.id, episodes.userId],
        }),
    ],
);

export type Episode = typeof episodes.$inferSelect;
