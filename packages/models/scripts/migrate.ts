#!/usr/bin/env bun
import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "@/client";

migrate(db, {
    migrationsFolder: "./drizzle",
});
