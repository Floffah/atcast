import {
    integer,
    json,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const userAuthRequests = pgTable("user_auth_requests", {
    id: serial("id").primaryKey(),
    did: varchar("did", { length: 32 }).notNull(),
    pkceVerifier: varchar("pkce_verifier", { length: 128 }).notNull(),
    state: varchar("state", { length: 128 }).notNull(),
    jwk: json("jwk"),
    expiresAt: timestamp("expires_at").notNull(),
});
