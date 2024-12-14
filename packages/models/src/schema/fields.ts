import { sql } from "drizzle-orm";

import { generatePublicId } from "@/lib";
import {timestamp, varchar} from "drizzle-orm/pg-core";

export const publicId = () =>
    varchar("public_id", { length: 36 })
        .notNull()
        .unique()
        .$defaultFn(() => generatePublicId());

export const createdAt = () =>
    timestamp("created_at")
        .notNull()
        .default(sql`now()`);
