import { pgEnum } from "drizzle-orm/pg-core";

export const oAuthProviderEnum = pgEnum("oauth_provider", ["BSKY"]);

