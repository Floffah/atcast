#!/usr/bin/env bun
import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "@/client";

if (process.env.CI == "1" && process.env.DATABASE_URL) {
    console.log("Migrating database...");
    migrate(db, {
        migrationsFolder: "./drizzle",
    });
} else {
    console.log("Skipping database migration");
}
