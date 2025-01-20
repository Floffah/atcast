import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { shows } from "@/schema/shows";
import { users } from "@/schema/users";

export const showCollaborators = pgTable(
    "show_collaborators",
    {
        userId: integer("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),
        showId: integer("show_id")
            .notNull()
            .references(() => shows.id, {
                onDelete: "cascade",
            }),
    },
    (showCollaborators) => [
        primaryKey({
            columns: [showCollaborators.userId, showCollaborators.showId],
        }),
    ],
);
