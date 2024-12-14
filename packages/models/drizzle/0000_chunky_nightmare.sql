CREATE TYPE "public"."oauth_provider" AS ENUM('BSKY');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_oauth_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" "oauth_provider" NOT NULL,
	"provider_user_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(36) NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(320),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_active_at" timestamp DEFAULT now(),
	CONSTRAINT "users_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(256) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"last_used_at" timestamp,
	CONSTRAINT "user_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "provider_user_id_idx" ON "user_oauth_providers" USING btree ("provider_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user_sessions" USING btree ("user_id");