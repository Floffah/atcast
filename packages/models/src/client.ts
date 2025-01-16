import * as schema from "./schema";
import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import { type NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";

let sql: NeonQueryFunction<false, false>, db: NeonHttpDatabase<typeof schema>;

if (
    typeof process.env.PRODUCTION_DATABASE_URL === "string" ||
    typeof process.env.DATABASE_URL === "string"
) {
    sql = neon(
        process.env.PRODUCTION_DATABASE_URL! ?? process.env.DATABASE_URL!,
    );

    db = drizzle(sql, {
        logger: process.env.NODE_ENV !== "production",
        schema,
    });
}

export { sql, db };
