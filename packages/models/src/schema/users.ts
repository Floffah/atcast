import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { createdAt, publicId, updatedAt } from "@/schema/fields";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    publicId: publicId(),

    handle: varchar("handle", { length: 256 }).notNull().unique(),
    did: text("did").notNull().unique(),
    email: varchar("email", { length: 320 }).unique(),

    lastActiveAt: timestamp("last_active_at").default(sql`CURRENT_TIMESTAMP`),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export type User = typeof users.$inferSelect;
