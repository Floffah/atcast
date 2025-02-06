import { sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/pg-core";

import { generatePublicId } from "@/lib";

export const publicIdLike = (name: string) => varchar(name, { length: 36 });

export const publicId = (name = "public_id") =>
    publicIdLike(name)
        .notNull()
        .unique()
        .$defaultFn(() => generatePublicId());

export const createdAt = (name = "created_at") =>
    timestamp(name).notNull().defaultNow();

export const updatedAt = () =>
    timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => sql`CURRENT_TIMESTAMP`);

export const uploadthingFileKey = (name: string) =>
    varchar(name, { length: 255 });
