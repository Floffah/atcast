import {
    index,
    integer,
    pgTable,
    serial,
    text,
    varchar,
} from "drizzle-orm/pg-core";

import { oAuthProviderEnum } from "@/schema/enums";

export const userOAuthProviders = pgTable(
    "user_oauth_providers",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id").notNull(),
        provider: oAuthProviderEnum("provider").notNull(),
        providerUserId: text("provider_user_id").notNull(),
    },
    (userOAuthProviders) => {
        return {
            providerUserIdIndex: index("provider_user_id_idx").on(
                userOAuthProviders.providerUserId,
            ),
        };
    },
);

export type UserOAuthProvider = typeof userOAuthProviders.$inferSelect;
