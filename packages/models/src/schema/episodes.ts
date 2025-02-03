import { pgTable, serial } from "drizzle-orm/pg-core";

import { createdAt, publicId } from "@/schema/fields";
import { users } from "@/schema/users";

export const episodes = pgTable("episodes", {
    id: serial("id").primaryKey(),
    publicId: publicId(),

    userId: serial("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),

    publishedAt: createdAt("published_at"),
});

export type Episode = typeof episodes.$inferSelect;
