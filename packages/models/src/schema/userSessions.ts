import {
    index,
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const userSessions = pgTable(
    "user_sessions",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id"),
        handle: varchar("handle", { length: 256 }).notNull(),
        token: varchar("token", { length: 256 }).notNull().unique(),
        pkceVerifier: varchar("pkce_verifier", { length: 128 }).notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        lastUsedAt: timestamp("last_used_at"),
    },
    (userSessions) => {
        return {
            userIdIndex: index("user_id_idx").on(userSessions.userId),
        };
    },
);

export type UserSession = typeof userSessions.$inferSelect;
