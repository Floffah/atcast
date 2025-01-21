import { pgEnum } from "drizzle-orm/pg-core";

export const oAuthProviderEnum = pgEnum("oauth_provider", ["BSKY"]);

export const showCollaboratorTypeEnum = pgEnum("show_collaborator_type", [
    "OWNER",
    "COLLABORATOR",
]);
