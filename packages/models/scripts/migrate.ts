#!/usr/bin/env bun
import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "@/client";

if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    migrate(db, {
        migrationsFolder: "./drizzle",
    });
}
