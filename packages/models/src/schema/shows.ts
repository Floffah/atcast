import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { createdAt, publicId } from "@/schema/fields";

export const shows = pgTable("shows", {
    id: serial("id").primaryKey(),
    publicId: publicId(),

    // following fields are NOT the source of truth, the document stored in the atproto repo is
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),

    lastEpisode: timestamp("last_episode"),
    createdAt: createdAt(),
});
