import { sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/pg-core";

import { generatePublicId } from "@/lib";

export const publicId = () =>
    varchar("public_id", { length: 36 })
        .notNull()
        .unique()
        .$defaultFn(() => generatePublicId());

export const createdAt = () =>
    timestamp("created_at")
        .notNull()
        .default(sql`now()`);
