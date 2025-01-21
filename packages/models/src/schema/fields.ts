import { sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/pg-core";

import { generatePublicId } from "@/lib";

export const publicId = (name = "public_id") =>
    varchar(name, { length: 36 })
        .notNull()
        .unique()
        .$defaultFn(() => generatePublicId());

export const createdAt = () => timestamp("created_at").notNull().defaultNow();

export const updatedAt = () =>
    timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => sql`CURRENT_TIMESTAMP`);
