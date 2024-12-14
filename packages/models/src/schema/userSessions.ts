import {
    index,
    integer,
    json,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const userSessions = pgTable(
    "user_sessions",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id").notNull(),
        token: varchar("token", { length: 256 }).notNull().unique(),
        accessToken: text("access_token").notNull(),
        refreshToken: text("refresh_token"),
        jwk: json("jwk"),
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
