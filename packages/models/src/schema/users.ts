import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { createdAt } from "@/schema/fields";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }).notNull().unique(),
        did: text("did").notNull().unique(),
        email: varchar("email", { length: 320 }).unique(),
        createdAt: createdAt(),
        lastActiveAt: timestamp("last_active_at").default(sql`now()`),
    },
    (users) => {
        return {};
    },
);

export type User = typeof users.$inferSelect;
